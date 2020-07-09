import {
  getBotFriendshipStatus as LineSDKGetBotFriendshipStatus,
  getCurrentAccessToken as LineSDKGetCurrentAccessToken,
  getProfile as LineSDKGetProfile,
  login as LineSDKLogin,
  logout as LineSDKLogout,
  refreshToken as LineSDKRefreshToken,
  verifyAccessToken as LineSDKVerifyAccessToken,
} from './lineSDKWrapper'

export {
  BotFriendshipStatus,
  AccessToken,
  AccessTokenVerifyResult,
  LoginArguments,
  LoginPermission,
  LoginResult,
  BotPrompt,
  UserProfile,
} from './types'

export default {
  getBotFriendshipStatus() {
    return LineSDKGetBotFriendshipStatus()
  },
  getCurrentAccessToken() {
    return LineSDKGetCurrentAccessToken()
  },
  getProfile() {
    return LineSDKGetProfile()
  },
  login(args = {}) {
    return LineSDKLogin(args)
  },
  logout() {
    return LineSDKLogout()
  },
  refreshToken() {
    return LineSDKRefreshToken()
  },
  verifyAccessToken() {
    return LineSDKVerifyAccessToken()
  },
}
