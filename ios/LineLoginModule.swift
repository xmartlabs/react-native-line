import Foundation
import LineSDK

@objc(LineLogin) public class LineLogin: NSObject {

  private let loginLock = NSLock()
  private var isLoginInProgress = false

  @objc public static func application(
    _ application: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool
  {
    return LoginManager.shared.application(application, open: url, options: options)
  }

  @objc public static func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool
  {
    return LoginManager.shared.application(application, open: userActivity.webpageURL)
  }

  @objc func setup(_ arguments: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let channelID = arguments["channelId"] as? String, !channelID.isEmpty else {
      reject("INVALID_ARGUMENTS", "channelId must be a non-empty string", nil)
      return
    }

    guard !LoginManager.shared.isSetupFinished else {
      resolve(nil)
      return
    }

    let universalLinkURL: URL? = (arguments["universalLinkUrl"] as? String).flatMap { URL(string: $0) }
    LoginManager.shared.setup(channelID: channelID, universalLinkURL: universalLinkURL)
    resolve(nil)
  }

  @objc func login(_ arguments: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    loginLock.lock()
    guard !isLoginInProgress else {
      loginLock.unlock()
      reject("LOGIN_IN_PROGRESS", "A login is already in progress", nil)
      return
    }
    isLoginInProgress = true
    loginLock.unlock()

    let scopes = (arguments["scopes"] as? [String])?.map { LoginPermission(rawValue: $0) } ?? [.profile]
    let onlyWebLogin = (arguments["onlyWebLogin"] as? Bool) ?? false
    var parameters = LoginManager.Parameters()

    if onlyWebLogin { parameters.onlyWebLogin = onlyWebLogin }

    if let botPromptRaw = arguments["botPrompt"] as? String {
      switch botPromptRaw {
      case "aggressive": parameters.botPromptStyle = LoginManager.BotPrompt(rawValue: "aggressive")
      case "normal":     parameters.botPromptStyle = LoginManager.BotPrompt(rawValue: "normal")
      default:
        loginLock.lock()
        isLoginInProgress = false
        loginLock.unlock()
        reject("INVALID_ARGUMENT", "Invalid botPrompt '\(botPromptRaw)'. Expected: 'normal' or 'aggressive'", nil)
        return
      }
    }

    DispatchQueue.main.async {
      LoginManager.shared.login(
        permissions: Set(scopes),
        in: nil,
        parameters: parameters) { [weak self] result in
          guard let self else { return }
          self.loginLock.lock()
          self.isLoginInProgress = false
          self.loginLock.unlock()
          switch result {
          case .success(let value): resolve(self.parseLoginResult(value))
          case .failure(let error): error.rejecter(reject)
          }
        }
    }
  }

  @objc func logout(_ resolve: @escaping RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) {
    LoginManager.shared.logout { result in
      switch result {
      case .success: resolve(nil)
      case .failure(let error): error.rejecter(reject)
      }
    }
  }

  @objc func getCurrentAccessToken(_ resolve: @escaping RCTPromiseResolveBlock,
                                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let token = AccessTokenStore.shared.current else {
      reject("ACCESS_TOKEN_NOT_AVAILABLE", "No access token is available", nil)
      return
    }
    resolve(self.parseAccessToken(token))
  }

  @objc func getFriendshipStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                                 rejecter reject: @escaping RCTPromiseRejectBlock) {
    API.getBotFriendshipStatus { result in
      switch result {
      case .success(let status): resolve(self.parseFriendshipStatus(status))
      case .failure(let error): error.rejecter(reject)
      }
    }
  }

  @objc func getProfile(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    API.getProfile { result in
      switch result {
      case .success(let profile): resolve(self.parseProfile(profile))
      case .failure(let error): error.rejecter(reject)
      }
    }
  }

  @objc func refreshAccessToken(_ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
    API.Auth.refreshAccessToken { result in
      switch result {
      case .success(let token): resolve(self.parseAccessToken(token))
      case .failure(let error): error.rejecter(reject)
      }
    }
  }

  @objc func verifyAccessToken(_ resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) {
    API.Auth.verifyAccessToken { result in
      switch result {
      case .success(let token): resolve(self.parseVerifyAccessToken(token))
      case .failure(let error): error.rejecter(reject)
      }
    }
  }

  private func parseFriendshipStatus(_ status: GetBotFriendshipStatusRequest.Response) -> NSDictionary {
    return [
      "friendFlag": status.friendFlag
    ]
  }

  private func parseAccessToken(_ accessToken: AccessToken) -> NSDictionary {
    var result: [String: Any] = [
      "accessToken": accessToken.value,
      "expiresIn":   Int(accessToken.expiresAt.timeIntervalSinceNow),
    ]
    if let idToken = accessToken.IDTokenRaw {
      result["idToken"] = idToken
    }
    return NSDictionary(dictionary: result)
  }

  private func parseProfile(_ profile: UserProfile) -> NSDictionary {
    var result: [String: Any] = [
      "displayName": profile.displayName,
      "userId":      profile.userID,
    ]
    if let url = profile.pictureURL {
      result["pictureUrl"] = url.absoluteString
    }
    if let message = profile.statusMessage {
      result["statusMessage"] = message
    }
    return NSDictionary(dictionary: result)
  }

  private func parseLoginResult(_ loginResult: LoginResult) -> NSDictionary {
    var result: [String: Any] = [
      "accessToken": self.parseAccessToken(loginResult.accessToken),
      "scope":       loginResult.permissions.map { $0.rawValue }.joined(separator: " "),
    ]
    if let changed = loginResult.friendshipStatusChanged {
      result["friendshipStatusChanged"] = changed
    }
    if let nonce = loginResult.IDTokenNonce {
      result["idTokenNonce"] = nonce
    }
    if let profile = loginResult.userProfile {
      result["userProfile"] = self.parseProfile(profile)
    }
    return NSDictionary(dictionary: result)
  }

  private func parseVerifyAccessToken(_ accessToken: AccessTokenVerifyResult) -> NSDictionary {
    return [
      "clientId":  accessToken.channelID,
      "expiresIn": accessToken.expiresIn,
      "scope":     accessToken.permissions.map { $0.rawValue }.joined(separator: " ")
    ]
  }
}

extension LineSDKError {
  func rejecter(_ reject: @escaping RCTPromiseRejectBlock) {
    let code = String(errorCode)
    let message = errorDescription ?? "Unknown error"
    reject(code, message, self)
  }
}
