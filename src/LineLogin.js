import { NativeModules } from 'react-native';

const { LineLoginManager } = NativeModules;

class LineLogin {
  /**
   * Logs the user.
   */
  login = () => {
    return LineLoginManager.login();
  }

  /**
   * Logs the user in with the requested permissions.
   */
  loginWithPermissions = (permissions) => {
    return LineLoginManager.loginWithPermissions(permissions);
  }

  /**
   * Logs the user in with options.
   * @param {Array} permissions Requested permissions
   * @param {String} botPrompt Requested bot link
   */
  loginWithOptions = (permissions, botPrompt) => {
    return LineLoginManager.loginWithOptions(permissions, botPrompt);
  }

  /**
   * Get the current access token.
   */
  currentAccessToken = () => {
    return LineLoginManager.currentAccessToken();
  }

  /**
   * Get user profile.
   */
  getUserProfile = () => {
    return LineLoginManager.getUserProfile();
  }  

  /**
   * Logs out the user.
   */
  logout = () => {
    LineLoginManager.logout();
  }
}

export default new LineLogin();
