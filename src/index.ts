import {
  getBotFriendshipStatus as LineSDKGetBotFriendshipStatus,
  getCurrentAccessToken as LineSDKGetCurrentAccessToken,
  getProfile as LineSDKGetProfile,
  login as LineSDKLogin,
  logout as LineSDKLogout,
  refreshToken as LineSDKRefreshToken,
  verifyAccessToken as LineSDKVerifyAccessToken,
  configure as LineSDKConfigure,
} from './lineSDKWrapper'

import {
  LoginArguments,
  ConfigureArguments,
  BotFriendshipStatus,
  AccessToken,
  AccessTokenVerifyResult,
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
  login(args: LoginArguments = {}) {
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
  configure(args: ConfigureArguments) {
    return LineSDKConfigure(args)
  },
}
