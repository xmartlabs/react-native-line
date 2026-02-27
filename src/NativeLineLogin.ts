/**
 * Native TurboModule specification for LINE Login.
 *
 * This file is consumed by React Native code generation — do not change method
 * signatures without regenerating the native specs.
 *
 * @see https://developers.line.biz/en/docs/line-login/
 */
import { TurboModule, TurboModuleRegistry } from 'react-native'

// ─── Enums ───────────────────────────────────────────────────────────────────

/** Controls whether the user is prompted to add the LINE Official Account as a friend during login. */
export enum BotPrompt {
  /** Shows a standalone screen after the consent screen asking the user to add the bot. */
  Aggressive = 'aggressive',
  /** Adds an inline "Add friend" option inside the consent screen. */
  Normal = 'normal',
}

/** OAuth scopes that can be requested during login. */
export enum Scope {
  /** Grants access to the user's email address. Requires channel approval from LINE. */
  Email = 'email',
  /** Issues an OpenID Connect ID token in the login response. Required to receive `idToken` and `idTokenNonce`. */
  OpenId = 'openid',
  /** Grants access to the user's basic profile: display name, picture URL, status message, and user ID. */
  Profile = 'profile',
}

// ─── Parameter types ─────────────────────────────────────────────────────────

export interface SetupParams {
  /** The LINE Login channel ID. */
  readonly channelId: string
  /**
   * Universal link URL registered for your LINE Login channel.
   * @platform ios
   */
  readonly universalLinkUrl?: string
}

export interface LoginParams {
  /**
   * Whether to skip the LINE app and go straight to the web-based login flow.
   * @default false
   */
  readonly onlyWebLogin?: boolean
  /**
   * OAuth scopes to request. Defaults to `[Scope.Profile]` when omitted.
   * @default [Scope.Profile]
   */
  readonly scopes?: Scope[]
  /**
   * Controls the bot friend-add prompt shown during login.
   * Only applicable when a LINE Official Account is linked to your channel.
   * @default BotPrompt.Normal
   */
  readonly botPrompt?: BotPrompt
}

// ─── Response types ──────────────────────────────────────────────────────────

export interface AccessToken {
  /** Bearer token used to authorize LINE API calls. */
  readonly accessToken: string
  /**
   * Seconds until the access token expires (OAuth standard `expires_in`).
   * Schedule a proactive refresh before this value reaches zero.
   */
  readonly expiresIn: number
  /**
   * Raw OpenID Connect ID token string.
   * Present only when `Scope.OpenId` was requested.
   */
  readonly idToken?: string
}

export interface UserProfile {
  /** The user's LINE display name. */
  readonly displayName: string
  /** URL of the user's profile picture. `undefined` if the user has not set one. */
  readonly pictureUrl?: string
  /** The user's LINE status message. `undefined` if the user has not set one. */
  readonly statusMessage?: string
  /** The user's LINE user ID. Stable across logins for the same channel. */
  readonly userId: string
}

export interface FriendshipStatus {
  /** `true` if the user has added the linked LINE Official Account as a friend. */
  readonly friendFlag: boolean
}

export interface LoginResult {
  /** The access token issued for this login session. */
  readonly accessToken: AccessToken
  /**
   * `true` if the user's friendship status with the linked LINE Official Account
   * changed during this login (e.g. they added the bot as a friend).
   * Only present when `BotPrompt.Normal` or `BotPrompt.Aggressive` was used.
   */
  readonly friendshipStatusChanged?: boolean
  /**
   * The nonce tied to the ID token. Pass this to your server when verifying the
   * ID token via the LINE server. `undefined` unless `Scope.OpenId`
   * was requested.
   * @see https://developers.line.biz/en/docs/line-login/verify-id-token/
   */
  readonly idTokenNonce?: string
  /**
   * Space-separated list of OAuth scopes granted (e.g. `"profile openid email"`).
   */
  readonly scope: string
  /**
   * The user's LINE profile. Present only when `Scope.Profile` was
   * included in the requested scopes.
   */
  readonly userProfile?: UserProfile
}

export interface VerifyResult {
  /** The LINE Login channel ID the access token was issued for. */
  readonly clientId: string
  /** Seconds until the access token expires. */
  readonly expiresIn: number
  /** Space-separated list of scopes granted to this access token. */
  readonly scope: string
}

// ─── TurboModule spec ────────────────────────────────────────────────────────

/**
 * Bridge interface consumed by the React Native native module system.
 * Use the default export for all SDK calls rather than referencing `Spec` directly.
 */
export interface Spec extends TurboModule {
  /** Initializes the LINE SDK with your channel credentials. Must be called before any other method. */
  setup(params: SetupParams): Promise<void>
  /** Starts the LINE login flow and resolves with the authenticated session. */
  login(params: LoginParams): Promise<LoginResult>
  /** Revokes the current user's access token and clears the local session. */
  logout(): Promise<void>
  /** Returns the locally cached access token without a network call. */
  getCurrentAccessToken(): Promise<AccessToken>
  /** Exchanges the current access token for a fresh one before it expires. */
  refreshAccessToken(): Promise<AccessToken>
  /** Validates the current access token against the LINE server and returns its metadata. */
  verifyAccessToken(): Promise<VerifyResult>
  /** Fetches the current user's LINE profile. Requires `Scope.Profile`. */
  getProfile(): Promise<UserProfile>
  /** Returns the friendship status between the current user and the channel's linked LINE Official Account. */
  getFriendshipStatus(): Promise<FriendshipStatus>
}

export default TurboModuleRegistry.getEnforcing<Spec>('LineLogin')
