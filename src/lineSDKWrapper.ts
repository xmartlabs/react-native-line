import { NativeModules } from 'react-native'

import {
  deserializeAccessToken,
  deserializeBotFriendshipStatus,
  deserializeLoginResult,
  deserializeUserProfile,
  deserializeVerifyAccessToken,
} from './deserializers'
import {
  AccessToken,
  AccessTokenVerifyResult,
  BotFriendshipStatus,
  LoginArguments,
  LoginResult,
  UserProfile,
} from './types'

const { LineLogin } = NativeModules

export const getBotFriendshipStatus = async (): Promise<BotFriendshipStatus> => {
  const result = await LineLogin.getBotFriendshipStatus()
  const deserializedResult = deserializeBotFriendshipStatus(result)
  return deserializedResult
}

export const getCurrentAccessToken = async (): Promise<AccessToken> => {
  const result = await LineLogin.getCurrentAccessToken()
  const deserializedResult = deserializeAccessToken(result)
  return deserializedResult
}

export const getProfile = async (): Promise<UserProfile> => {
  const result = await LineLogin.getProfile()
  const deserializedResult = deserializeUserProfile(result)
  return deserializedResult
}

export const login = async (
  args: LoginArguments = {},
): Promise<LoginResult> => {
  const result = await LineLogin.login(args)
  const deserializedResult = deserializeLoginResult(result)
  return deserializedResult
}

export const logout = () => {
  return LineLogin.logout()
}

export const refreshToken = async (): Promise<AccessToken> => {
  const result = await LineLogin.refreshToken()
  const deserializedResult = deserializeAccessToken(result)
  return deserializedResult
}

export const verifyAccessToken = async (): Promise<AccessTokenVerifyResult> => {
  const result = await LineLogin.verifyAccessToken()
  const deserializedResult = deserializeVerifyAccessToken(result)
  return deserializedResult
}
