export enum BotPrompt {
  /** Opens a new screen to add a LINE Official Account as a friend after the user agrees to the permissions in the consent screen. */
  Aggressive = 'aggressive',
  /** Includes an option to add a LINE Official Account as a friend in the consent screen. */
  Normal = 'normal',
}

export enum LoginPermission {
  Email = 'email',
  /** To get an ID token in the login response. */
  OpenId = 'openid',
  /** To get user's profile including the user ID, display name, and the profile image URL in the login response. */
  Profile = 'profile',
}

export interface AccessToken {
  /** The value of the access token. */
  accessToken: string
  /** The amount of time until the access token expires. */
  expiresIn: string
  /** The raw string of the ID token bound to the access token. Only if the access token is obtained with the `.openID` permission. */
  idToken?: string
}

export interface FriendshipStatus {
  /** Whether the LINE Official Account is a friend of the user or not. */
  friendFlag: boolean
}

export interface LoginParams {
  botPrompt?: BotPrompt
  onlyWebLogin?: boolean
  scopes?: LoginPermission[]
}

export interface UserProfile {
  /** User's display name. */
  displayName: string
  /** User's profile image URL. */
  pictureUrl?: string
  /** User's status message. */
  statusMessage?: string
  /** User's user ID. */
  userId: string
}

export interface LoginResult {
  /** The access token obtained by the login process. */
  accessToken: AccessToken
  /** Indicates that the friendship status between the user and the bot changed during the login. This value is
      non-`null` only if the `.botPromptNormal` or `.botPromptAggressive` are specified as part of the
      `LoginManagerOption` object when the user logs in. For more information, see Linking a bot with your LINE
      Login channel at https://developers.line.me/en/docs/line-login/web/link-a-bot/. */
  friendshipStatusChanged?: boolean
  /** The `nonce` value when requesting ID Token during login process. Use this value as a parameter when you
      verify the ID Token against the LINE server. This value is `null` if `.openID` permission is not requested. */
  idTokenNonce?: string
  /** The permissions bound to the `accessToken` object by the authorization process. Scope has them separated by spaces. */
  scope: string
  /** Contains the user profile including the user ID, display name, and so on.
      The value exists only when the `.profile` permission is set in the authorization request. */
  userProfile?: UserProfile
}

export interface VerifyResult {
  /** The channel ID bound to the access token. */
  clientId: string
  /** The amount of time until the access token expires. */
  expiresIn: string
  /** Valid permissions of the access token separated by spaces */
  scope: string
}
