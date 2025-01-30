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

const { LineLogin } = NativeModules

/**
 * Gets the access token that the SDK is using for the user.
 * @returns
 */
async function getCurrentAccessToken(): Promise<AccessToken> {
  return await LineLogin.getCurrentAccessToken()
}

/**
 * Gets the friendship status between the LINE Official Account (which is linked to the current channel) and the user.
 * @returns
 */
async function getFriendshipStatus(): Promise<FriendshipStatus> {
  return await LineLogin.getFriendshipStatus()
}

/**
 * Gets the user profile information.
 * @returns
 */
async function getProfile(): Promise<UserProfile> {
  return await LineLogin.getProfile()
}

/**
 * Logs in the user.
 * @param params
 * @returns
 */
async function login(params: LoginParams = {}): Promise<LoginResult> {
  return await LineLogin.login(params)
}

/**
 * Revokes the access token.
 */
async function logout() {
  return await LineLogin.logout()
}

/**
 * Refreshes the access token that the SDK is using for the user.
 * @returns
 */
async function refreshAccessToken(): Promise<AccessToken> {
  return await LineLogin.refreshAccessToken()
}

/**
 * Checks whether the access token that the SDK is using for the user is valid.
 * @returns
 */
async function verifyAccessToken(): Promise<VerifyResult> {
  return await LineLogin.verifyAccessToken()
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
  verifyAccessToken,
}
