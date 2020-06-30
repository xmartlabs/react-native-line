import { AuthReducer } from './auth/reducer'
import { AuthActions } from 'src/context/auth/types'

export const rootReducer = ({ auth }, action: AuthActions) => {
  return {
    auth: AuthReducer(auth, action),
  }
}
