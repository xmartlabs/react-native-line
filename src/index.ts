import {
  getBotFriendshipStatus as LineSDKGetBotFriendshipStatus,
  getCurrentAccessToken as LineSDKGetCurrentAccessToken,
  getProfile as LineSDKGetProfile,
  login as LineSDKLogin,
  logout as LineSDKLogout,
  refreshToken as LineSDKRefreshToken,
  verifyAccessToken as LineSDKVerifyAccessToken,
} from './lineSDKWrapper'
import {
  AccessToken,
  AccessTokenVerifyResult,
  BotFriendshipStatus,
  BotPrompt,
  LoginArguments,
  LoginPermission,
  LoginResult,
  UserProfile,
} from './types'

export {
  BotFriendshipStatus,
  AccessToken,
  AccessTokenVerifyResult,
  LoginArguments,
  LoginPermission,
  LoginResult,
  BotPrompt,
  UserProfile,
}

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
}
