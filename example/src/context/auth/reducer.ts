import { actionTypes } from './actionTypes'
import { AuthActions, AuthState } from './types'

export const initialState: AuthState = {
  error: undefined,
  loading: false,
  loginResult: undefined,
}

export const AuthReducer = (
  state = initialState,
  action: AuthActions,
): AuthState => {
  switch (action.type) {
    case actionTypes.AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: undefined,
      }
    case actionTypes.AUTH_CLEAR_STATE:
      return initialState
    case actionTypes.AUTH_LOADING:
      return {
        ...state,
        loading: true,
      }
    case actionTypes.AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      }
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        loginResult: action.payload.loginResult,
      }
    default:
      return state
  }
}
