export function getBotFriendshipStatus(): Promise<any>
export function getCurrentAccessToken(): Promise<AccessToken>
export function getProfile(): Promise<UserProfile>
export function login(args?: LoginArguments): Promise<LoginResult>
export function logout(): Promise<void>
export function refreshToken(): Promise<AccessToken>
export function verifyAccessToken(): Promise<AccessTokenVerifyResult>

export interface AccessToken {
  /// The value of the access token.
  access_token: String

  /// The expiration time of the access token. It is calculated using `createdAt` and the validity period
  /// of the access token. This value might not be the actual expiration time because this value depends
  /// on the system time of the device when `createdAt` is determined.
  expires_in: String

  /// The creation time of the access token. It is the system time of the device that receives the current
  /// access token.
  createdAt: String

  /// The refresh token bound to the access token.
  /// `refreshToken` is not publicly provided anymore. You should not access or store it yourself.
  refresh_token: String

  token_type: String

  /// Permissions separated by spaces
  scope: String
}

export interface AccessTokenVerifyResult {
  // The channel ID bound to the access token.
  client_id: String

  /// The amount of time until the access token expires.
  expires_in: String

  /// Valid permissions of the access token separated by spaces
  scope: String
}

export enum BotPrompt {
  agressive = 'agressive',
  normal = 'normal',
}

export interface LoginArguments {
  scopes?: LoginPermission[]
  onlyWebLogin?: boolean
  botPrompt?: BotPrompt
}

export enum LoginPermission {
  email = 'email',
  /// The permission to get an ID token in the login response.
  openID = 'openid',

  /// The permission to get the user's profile including the user ID, display name, and the profile image
  /// URL in the login response.
  profile = 'profile',
}

export interface LoginResult {
  /// The access token obtained by the login process.
  accessToken: AccessToken
  /// The permissions bound to the `accessToken` object by the authorization process. Scope has them separated by spaces
  scope: String
  /// Contains the user profile including the user ID, display name, and so on. The value exists only when the
  /// `.profile` permission is set in the authorization request.
  userProfile?: UserProfile
  /// Indicates that the friendship status between the user and the bot changed during the login. This value is
  /// non-`null` only if the `.botPromptNormal` or `.botPromptAggressive` are specified as part of the
  /// `LoginManagerOption` object when the user logs in. For more information, see Linking a bot with your LINE
  /// Login channel at https://developers.line.me/en/docs/line-login/web/link-a-bot/.
  friendshipStatusChanged?: boolean
  /// The `nonce` value when requesting ID Token during login process. Use this value as a parameter when you
  /// verify the ID Token against the LINE server. This value is `null` if `.openID` permission is not requested.
  IDTokenNonce?: String
  /// The raw string value of the ID token bound to the access token. The value exists only if the access token
  /// is obtained with the `.openID` permission.
  lineIdToken?: String
}

export interface UserProfile {
  /// The user ID of the current authorized user.
  userID: String

  /// The display name of the current authorized user.
  displayName: String

  /// The email of the current authorized user.
  email?: String

  /// The profile image URL of the current authorized user. `null` if the user has not set a profile
  /// image.
  pictureURL?: URL

  /// The large profile image URL of the current authorized user. `null` if the user has not set a profile
  /// image.
  pictureURLLarge?: URL

  /// The small profile image URL of the current authorized user. `null` if the user has not set a profile
  /// image.
  pictureURLSmall?: URL

  /// The status message of the current authorized user. `null` if the user has not set a status message.
  statusMessage?: String
}
