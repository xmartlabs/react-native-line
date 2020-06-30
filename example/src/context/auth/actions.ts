import { actionTypes } from './actionTypes'
import {
  AuthSuccess,
  AuthLoading,
  AuthError,
  AuthClearError,
  AuthClearState,
} from './types'
import { LoginResult } from '@xmartlabs/react-native-line'

export const clearError = (): AuthClearError => ({
  type: actionTypes.AUTH_CLEAR_ERROR,
})

export const authError = (error: string): AuthError => ({
  payload: {
    error,
  },
  type: actionTypes.AUTH_ERROR,
})

export const authLoading = (): AuthLoading => ({
  type: actionTypes.AUTH_LOADING,
})

export const authSuccess = (loginResult: LoginResult): AuthSuccess => ({
  payload: {
    loginResult,
  },
  type: actionTypes.AUTH_SUCCESS,
})

export const authClearState = (): AuthClearState => ({
  type: actionTypes.AUTH_CLEAR_STATE,
})
