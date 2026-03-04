/** OAuth scopes that can be requested during login. */
export enum Scope {
  /** Grants access to the user's email address. Requires channel approval from LINE. */
  Email = 'email',
  /** Issues an OpenID Connect ID token in the login response. Required to receive `idToken` and `idTokenNonce`. */
  OpenId = 'openid',
  /** Grants access to the user's basic profile: display name, picture URL, status message, and user ID. */
  Profile = 'profile',
}
