import { randomBase64Url, sha256Base64Url } from './crypto'
import { Scope } from './elements'
import {
  type AccessToken,
  type FriendshipStatus,
  type LoginParams,
  type LoginResult,
  type SetupParams,
  type UserProfile,
  type VerifyResult,
} from './NativeLineLogin'

const LINE_AUTH_URL = 'https://access.line.me/oauth2/v2.1/authorize'
const LINE_TOKEN_URL = 'https://api.line.me/oauth2/v2.1/token'
const LINE_REVOKE_URL = 'https://api.line.me/oauth2/v2.1/revoke'
const LINE_PROFILE_URL = 'https://api.line.me/v2/profile'
const LINE_FRIENDSHIP_URL = 'https://api.line.me/friendship/v1/status'
const LINE_VERIFY_URL = 'https://api.line.me/oauth2/v2.1/verify'

const SESSION_KEY = '@line_sdk/session'

let channelId = ''
let redirectUri = ''

interface Session {
  accessToken: string
  expiresAt: number
  idToken?: string
  refreshToken?: string
}

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function saveSession(session: Session): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function requireSession(): Session {
  const session = loadSession()
  if (!session) {
    throw new Error('Not authenticated. Call login() first.')
  }
  return session
}

function sessionToToken(session: Session): AccessToken {
  return {
    accessToken: session.accessToken,
    expiresIn: Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000)),
    ...(session.idToken ? { idToken: session.idToken } : {}),
  }
}

async function setup(params: SetupParams): Promise<void> {
  if (!params.channelId) throw new Error('channelId is required')
  channelId = params.channelId
  redirectUri = params.redirectUri ?? window.location.origin
}

/**
 * Initiates the LINE Login OAuth 2.0 flow via a popup window.
 *
 * Uses a code_verifier/code_challenge pair so the authorization code can be exchanged client-side — no
 * channel secret or server-side proxy needed. The popup is closed
 * automatically once LINE redirects back to `redirectUri`.
 *
 * `redirectUri` must be same-origin with the page calling `login()` so the
 * opener can read the popup's final URL.
 *
 * @see https://developers.line.biz/en/docs/line-login/integrate-line-login/
 */
async function login(params: LoginParams): Promise<LoginResult> {
  if (!channelId) throw new Error('Call setup() before login()')

  const scope = params.scopes?.length ? params.scopes.join(' ') : Scope.Profile
  const state = randomBase64Url()
  const codeVerifier = randomBase64Url()
  const codeChallenge = await sha256Base64Url(codeVerifier)
  const nonce = scope.includes(Scope.OpenId) ? randomBase64Url() : undefined

  const query = new URLSearchParams({
    client_id: channelId,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    state,
  })

  if (nonce) query.set('nonce', nonce)
  if (params.botPrompt) query.set('bot_prompt', params.botPrompt)
  if (params.onlyWebLogin) query.set('disable_auto_login', 'true')

  const popup = window.open(
    `${LINE_AUTH_URL}?${query}`,
    'line_login',
    'width=480,height=640',
  )
  if (!popup) throw new Error('Popup blocked. Allow popups for this site.')

  const callbackUrl = await new Promise<string>((resolve, reject) => {
    const timer = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(timer)
          reject(new Error('Login cancelled'))
          return
        }
        if (popup.location.href.startsWith(redirectUri)) {
          clearInterval(timer)
          const url = popup.location.href
          popup.close()
          resolve(url)
        }
      } catch {}
    }, 200)
  })

  const cbParams = new URLSearchParams(new URL(callbackUrl).search)
  const error = cbParams.get('error')
  if (error) throw new Error(cbParams.get('error_description') ?? error)

  const code = cbParams.get('code')
  if (!code) throw new Error('Missing authorization code in callback URL')
  if (cbParams.get('state') !== state)
    throw new Error('State mismatch — possible CSRF attack')

  const body = new URLSearchParams({
    client_id: channelId,
    code,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  })
  const tokenRes = await fetch(LINE_TOKEN_URL, {
    body: body.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
  })
  if (!tokenRes.ok) throw new Error(`Token exchange failed: ${tokenRes.status}`)
  const tokenData = await tokenRes.json()

  const session: Session = {
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + tokenData.expires_in * 1000,
    ...(tokenData.id_token ? { idToken: tokenData.id_token } : {}),
    ...(tokenData.refresh_token
      ? { refreshToken: tokenData.refresh_token }
      : {}),
  }
  saveSession(session)

  const rawFriendship = cbParams.get('friendship_status_changed')
  const friendshipStatusChanged =
    rawFriendship != null ? rawFriendship === 'true' : undefined

  let userProfile: UserProfile | undefined
  if (scope.includes(Scope.Profile)) {
    userProfile = await getProfile()
  }

  return {
    accessToken: sessionToToken(session),
    scope: tokenData.scope ?? scope,
    ...(friendshipStatusChanged != null ? { friendshipStatusChanged } : {}),
    ...(nonce ? { idTokenNonce: nonce } : {}),
    ...(userProfile ? { userProfile } : {}),
  }
}

async function logout(): Promise<void> {
  const session = loadSession()
  if (session && channelId) {
    try {
      const body = new URLSearchParams({
        access_token: session.accessToken,
        client_id: channelId,
      })
      await fetch(LINE_REVOKE_URL, {
        body: body.toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      })
    } catch {}
  }
  sessionStorage.removeItem(SESSION_KEY)
}

async function getCurrentAccessToken(): Promise<AccessToken> {
  return sessionToToken(requireSession())
}

async function refreshAccessToken(): Promise<AccessToken> {
  const session = requireSession()
  if (!session.refreshToken) throw new Error('No refresh token available.')
  const body = new URLSearchParams({
    client_id: channelId,
    grant_type: 'refresh_token',
    refresh_token: session.refreshToken,
  })
  const res = await fetch(LINE_TOKEN_URL, {
    body: body.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
  })
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)
  const data = await res.json()
  const updated: Session = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    ...(data.id_token ? { idToken: data.id_token } : {}),
    refreshToken: data.refresh_token ?? session.refreshToken,
  }
  saveSession(updated)
  return sessionToToken(updated)
}

async function getProfile(): Promise<UserProfile> {
  const { accessToken } = requireSession()
  const headers = { Authorization: `Bearer ${accessToken}` }
  const res = await fetch(LINE_PROFILE_URL, { headers })
  if (!res.ok) throw new Error(`Failed to get profile: ${res.status}`)
  const data = await res.json()
  return {
    displayName: data.displayName,
    userId: data.userId,
    ...(data.pictureUrl != null ? { pictureUrl: data.pictureUrl } : {}),
    ...(data.statusMessage != null
      ? { statusMessage: data.statusMessage }
      : {}),
  }
}

async function getFriendshipStatus(): Promise<FriendshipStatus> {
  const { accessToken } = requireSession()
  const headers = { Authorization: `Bearer ${accessToken}` }
  const res = await fetch(LINE_FRIENDSHIP_URL, { headers })
  if (!res.ok) throw new Error(`Failed to get friendship status: ${res.status}`)
  const data = await res.json()
  return {
    friendFlag: data.friendFlag,
  }
}

async function verifyAccessToken(): Promise<VerifyResult> {
  const { accessToken } = requireSession()
  const access_token = `access_token=${encodeURIComponent(accessToken)}`
  const res = await fetch(`${LINE_VERIFY_URL}?${access_token}`)
  if (!res.ok) throw new Error(`Failed to verify access token: ${res.status}`)
  const data = await res.json()
  return {
    channelId: String(data.client_id),
    expiresIn: data.expires_in,
    scope: data.scope,
  }
}

export default {
  getCurrentAccessToken,
  getFriendshipStatus,
  getProfile,
  login,
  logout,
  refreshAccessToken,
  setup,
  verifyAccessToken,
}
