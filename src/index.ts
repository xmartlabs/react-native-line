import { NativeModules } from 'react-native'

import {
  AccessToken,
  BotPrompt,
  FriendshipStatus,
  LoginParams,
  LoginPermission,
  LoginResult,
  UserProfile,
  VerifyResult,
} from './types'

/**
 * Gets the access token of the current user.
 * @returns
 */
async function getCurrentAccessToken(): Promise<AccessToken> {
  return await NativeModules.LineLogin.getCurrentAccessToken()
}

/**
 * Gets the friendship status between the LINE Official Account (which is linked to the current channel) and the user.
 * @returns
 */
async function getFriendshipStatus(): Promise<FriendshipStatus> {
  return await NativeModules.LineLogin.getFriendshipStatus()
}

/**
 * Gets the current user profile information.
 * @returns
 */
async function getProfile(): Promise<UserProfile> {
  return await NativeModules.LineLogin.getProfile()
}

/**
 * Initializes the Line SDK.
 * @param channelId
 */
async function setup(channelId: string): Promise<void> {
  return await NativeModules.LineLogin.setup(channelId)
}

/**
 * Logs in the user.
 * @param params
 * @returns
 */
async function login(params: LoginParams = {}): Promise<LoginResult> {
  return await NativeModules.LineLogin.login(params)
}

/**
 * Revokes the access token of the current user.
 */
async function logout() {
  return await NativeModules.LineLogin.logout()
}

/**
 * Refreshes the access token of the current user.
 * @returns
 */
async function refreshAccessToken(): Promise<AccessToken> {
  return await NativeModules.LineLogin.refreshAccessToken()
}

/**
 * Checks whether the access token of the current user is valid.
 * @returns
 */
async function verifyAccessToken(): Promise<VerifyResult> {
  return await NativeModules.LineLogin.verifyAccessToken()
}

export {
  AccessToken,
  BotPrompt,
  FriendshipStatus,
  LoginParams,
  LoginPermission,
  LoginResult,
  UserProfile,
  VerifyResult,
}

export default {
  getCurrentAccessToken,
  getFriendshipStatus,
  getProfile,
  login,
  logout,
  refreshAccessToken,
  setup,
  verifyAccessToken,
}
