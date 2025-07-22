import Foundation
import LineSDK

@objc(LineLogin) public class LineLogin: NSObject {
  
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
    restorationHandler: @escaping ([Any]) -> Void) -> Bool
  {
    return LoginManager.shared.application(application, open: userActivity.webpageURL)
  }
  
  @objc func setup(_ arguments: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    guard !LoginManager.shared.isSetupFinished else {
      reject("SETUP_ALREADY_COMPLETED", "Setup is already completed", nil)
      return
    }
    
    guard let channelID = arguments["channelId"] as? String else {
      reject("INVALID_ARGUMENTS", "Missing required argument: channelId", nil)
      return
    }
    
    let universalLinkURL: URL? = (arguments["universalLinkUrl"] as? String).flatMap { URL(string: $0) }
    LoginManager.shared.setup(channelID: channelID, universalLinkURL: universalLinkURL)
    resolve(nil)
  }
  
  @objc func login(_ arguments: NSDictionary?, resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    guard let args = arguments else {
      reject("INVALID_ARGUMENTS", "Expected argument is nil", NSError(domain: "", code: 200, userInfo: nil))
      return
    }
    
    let scopes = (args["scopes"] as? [String])?.map { LoginPermission(rawValue: $0) } ?? [.profile]
    let onlyWebLogin = (args["onlyWebLogin"] as? Bool) ?? false
    var parameters = LoginManager.Parameters.init()
    
    if onlyWebLogin { parameters.onlyWebLogin = onlyWebLogin }
    
    if let botPrompt = args["botPrompt"] as? String {
      switch botPrompt {
      case "aggressive": parameters.botPromptStyle = LoginManager.BotPrompt(rawValue: "aggressive")
      case "normal": parameters.botPromptStyle = LoginManager.BotPrompt(rawValue: "normal")
      default: break
      }
    }
    
    DispatchQueue.main.async {
      LoginManager.shared.login(
        permissions: Set(scopes),
        in: nil,
        parameters: parameters) { result in
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
      "createdAt": accessToken.createdAt,
      "expiresIn": accessToken.expiresAt,
    ]
    
    if let idToken = accessToken.IDTokenRaw {
      result["idToken"] = idToken
    }
    
    return NSDictionary(dictionary: result)
  }
  
  private func parseProfile(_ profile: UserProfile) -> NSDictionary {
    return [
      "displayName": profile.displayName,
      "pictureUrl": profile.pictureURL?.absoluteString,
      "statusMessage": profile.statusMessage,
      "userId": profile.userID
    ]
  }
  
  private func parseLoginResult(_ loginResult: LoginResult) -> NSDictionary {
    return [
      "accessToken": self.parseAccessToken(loginResult.accessToken),
      "friendshipStatusChanged": loginResult.friendshipStatusChanged,
      "idTokenNonce": loginResult.IDTokenNonce,
      "scope": loginResult.permissions.map { $0.rawValue }.joined(separator: " "),
      "userProfile": loginResult.userProfile.map(self.parseProfile)
    ]
  }
  
  private func parseVerifyAccessToken(_ accessToken: AccessTokenVerifyResult) -> NSDictionary {
    return [
      "channelId": accessToken.channelID,
      "expiresIn": accessToken.expiresIn,
      "scope": accessToken.permissions.map { $0.rawValue }.joined(separator: " ")
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
