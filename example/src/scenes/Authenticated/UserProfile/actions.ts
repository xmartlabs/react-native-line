import Line from '@xmartlabs/react-native-line'
import { AuthProps } from 'src/context/auth/provider'

interface LoginActionProps extends AuthProps {
  navigateToUnauthenticated: () => boolean
}

export const logout = ({
  dispatchClearError,
  setLoading,
  setAuthError,
  navigateToUnauthenticated,
}: LoginActionProps) => {
  return async () => {
    try {
      dispatchClearError()
      setLoading()
      await Line.logout()
      navigateToUnauthenticated()
    } catch (error) {
      setAuthError(error)
    }
  }
}
