import { NativeModules } from 'react-native'

const { LineLogin } = NativeModules

const BotPrompt = {
  agressive: 'agressive',
  normal: 'normal',
}
const LoginPermission = {
  email: 'email',
  openID: 'openID',
  profile: 'profile',
}

export { LoginPermission, BotPrompt }

export default {
  getBotFriendshipStatus() {
    return LineLogin.getBotFriendshipStatus()
  },
  getCurrentAccessToken() {
    return LineLogin.getCurrentAccessToken()
  },
  getProfile() {
    return LineLogin.getProfile()
  },
  login(args = {}) {
    return LineLogin.login(args)
  },
  logout() {
    return LineLogin.logout()
  },
  refreshToken() {
    return LineLogin.refreshToken()
  },
  verifyAccessToken() {
    return LineLogin.verifyAccessToken()
  },
}
