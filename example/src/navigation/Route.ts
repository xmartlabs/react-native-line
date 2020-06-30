export enum Route {
  // Auth stack
  Authenticated = 'Authenticated',
  CheckSession = 'CheckSession',
  Unauthenticated = 'Unauthenticated',

  // Tab stack
  TabNavigator = 'TabNavigator',
  UserTab = 'UserTab',
  API = 'API',

  // UserTab stack
  UserDetails = 'UserDetails',

  // API stack
  API_GetProfile = 'API_GetProfile',
  API_GetCurrentAccessToken = 'API_GetCurrentAccessToken',
  API_VerifyAccessToken = 'API_VerifyAccessToken',
  API_RefreshToken = 'API_RefreshToken',
}
