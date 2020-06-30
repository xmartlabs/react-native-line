import React from 'react'

import { useReducer, useMemo, useContext, createContext } from 'react'
import { AuthReducer, initialState } from './reducer'
import {
  authSuccess,
  authError,
  authLoading,
  authClearState,
  clearError,
} from './actions'
import { LoginResult } from '@xmartlabs/react-native-line'
import { AuthState, AuthActions } from './types'
import AsyncStorage from '@react-native-community/async-storage'
import { PersistedKeys } from 'src/context/persistedKeys'

const AuthContext = createContext(undefined)

export const AuthProvider = (props: any) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  const value = useMemo(() => [state, dispatch], [state])
  return <AuthContext.Provider value={value} {...props} />
}

export interface AuthProps {
  error?: string
  loading: boolean
  loginResult?: LoginResult
  setAuthError: (error: string) => void
  setLoading: () => void
  setPersistedLoginResult: (loginResult: LoginResult) => Promise<void>
  clearState: () => Promise<void>
  dispatchClearError: () => void
  getLoginResult: () => Promise<any>
}

export const useAuth = (): AuthProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  const [state, dispatch]: [AuthState, React.Dispatch<AuthActions>] = context
  const setPersistedLoginResult = (loginResult: LoginResult) =>
    persistAuth(loginResult, dispatch)
  const setLoginResult = (loginResult: LoginResult) =>
    dispatch(authSuccess(loginResult))
  const setAuthError = (error: string) => dispatch(authError(error))
  const setLoading = () => dispatch(authLoading())
  const clearState = () => clearPersistedAuth(dispatch)
  const dispatchClearError = () => dispatch(clearError())
  const getLoginResult = async () => {
    try {
      dispatch(clearError())
      if (state && state.loginResult) return state.loginResult
      const parsedLoginResult = await AsyncStorage.getItem(
        PersistedKeys.LOGIN_RESULT,
      )
      if (parsedLoginResult) {
        const loginResult = JSON.parse(parsedLoginResult)
        setLoginResult(loginResult)
        return loginResult
      }
    } catch (e) {
      setAuthError(`Error checkin session: ${e}`)
    }
  }
  return {
    error: state.error,
    loading: state.loading,
    loginResult: state.loginResult,
    setAuthError,
    setLoading,
    setPersistedLoginResult,
    clearState,
    dispatchClearError,
    getLoginResult,
  }
}

const persistAuth = async (
  loginResult: LoginResult,
  dispatch: React.Dispatch<AuthActions>,
) => {
  try {
    dispatch(clearError())
    await AsyncStorage.setItem(
      PersistedKeys.LOGIN_RESULT,
      JSON.stringify(loginResult),
    )
    dispatch(authSuccess(loginResult))
  } catch (e) {
    dispatch(authError(`Error persisting login result: ${e}`))
  }
}

const clearPersistedAuth = async (dispatch: React.Dispatch<AuthActions>) => {
  try {
    dispatch(clearError())
    await AsyncStorage.clear()
    dispatch(authClearState())
  } catch (e) {
    dispatch(authError(`Error clearing login result: ${e}`))
  }
}
