import {
  AccessToken,
  AccessTokenVerifyResult,
  BotFriendshipStatus,
  LoginResult,
  UserProfile,
} from '../types'

export const deserializeLoginResult = (data: any): LoginResult => ({
  IDTokenNonce: data.IDTokenNonce,
  accessToken: deserializeAccessToken(data.accessToken),
  friendshipStatusChanged: data.friendshipStatusChanged,
  scope: data.scope,
  userProfile: data.userProfile,
})

export const deserializeAccessToken = (data: any): AccessToken => ({
  access_token: data.access_token,
  expires_in: data.expires_in,
  id_token: data.id_token ?? undefined,
})

export const deserializeUserProfile = (data: any): UserProfile => ({
  displayName: data.displayName,
  pictureURL: data.pictureURL ?? undefined,
  statusMessage: data.statusMessage ?? undefined,
  userID: data.userID,
})

export const deserializeVerifyAccessToken = (
  data: any,
): AccessTokenVerifyResult => ({
  client_id: data.client_id,
  expires_in: data.expires_in,
  scope: data.scope,
})

export const deserializeBotFriendshipStatus = (
  data: any,
): BotFriendshipStatus => ({
  friendFlag: data.friendFlag ?? false,
})
