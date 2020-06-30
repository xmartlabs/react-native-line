import { LoginResult } from '@xmartlabs/react-native-line'
import { actionTypes } from './actionTypes'

export interface AuthState {
  error?: string
  loading: boolean
  loginResult?: LoginResult
}

export interface AuthError {
  payload: {
    error: string
  }
  type: actionTypes.AUTH_ERROR
}

export interface AuthClearError {
  type: actionTypes.AUTH_CLEAR_ERROR
}

export interface AuthClearState {
  type: actionTypes.AUTH_CLEAR_STATE
}

export interface AuthLoading {
  type: actionTypes.AUTH_LOADING
}

export interface AuthSuccess {
  payload: {
    loginResult: LoginResult
  }
  type: actionTypes.AUTH_SUCCESS
}

export type AuthActions =
  | AuthError
  | AuthClearError
  | AuthClearState
  | AuthLoading
  | AuthSuccess
