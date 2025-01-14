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

export async function getBotFriendshipStatus(): Promise<BotFriendshipStatus> {
  const result = await LineLogin.getBotFriendshipStatus()
  return deserializeBotFriendshipStatus(result)
}

export async function getCurrentAccessToken(): Promise<AccessToken> {
  const result = await LineLogin.getCurrentAccessToken()
  return deserializeAccessToken(result)
}

export async function getProfile(): Promise<UserProfile> {
  const result = await LineLogin.getProfile()
  return deserializeUserProfile(result)
}

export async function login(args: LoginArguments = {}): Promise<LoginResult> {
  const result = await LineLogin.login(args)
  return deserializeLoginResult(result)
}

export async function logout() {
  return LineLogin.logout()
}

export async function refreshToken(): Promise<AccessToken> {
  const result = await LineLogin.refreshToken()
  return deserializeAccessToken(result)
}

export async function verifyAccessToken(): Promise<AccessTokenVerifyResult> {
  const result = await LineLogin.verifyAccessToken()
  return deserializeVerifyAccessToken(result)
}
