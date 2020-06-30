import Line from '@xmartlabs/react-native-line'
import { AuthProps } from 'src/context/auth/provider'

interface LoginActionProps extends AuthProps {
  navigateToAuthenticated: () => boolean
}

export function login({
  dispatchClearError,
  setLoading,
  setPersistedLoginResult,
  navigateToAuthenticated,
  setAuthError,
}: LoginActionProps) {
  return async () => {
    try {
      dispatchClearError()
      setLoading()
      setPersistedLoginResult(await Line.login())
      navigateToAuthenticated()
    } catch (error) {
      setAuthError(error.message)
    }
  }
}
