//
//  LineLogin.swift
//  RNLine
//
//  Created by Emiliano Botti on 9/25/19.
//  Copyright © 2019 XmartLabs S.R.L.. All rights reserved.
//

import Foundation
import LineSDK

@objc(LineLogin) public class LineLogin: NSObject {
  
  // Setup to be called in AppDelegate
  @objc public static func setup(channelID: String, universalLinkURL: URL?) {
    return LoginManager.shared.setup(channelID: channelID, universalLinkURL: universalLinkURL)
  }
  
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

  // Interface to be used by React Native
  @objc func login(_ arguments: NSDictionary?, resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard let args = arguments else {
      LineLogin.nilArgument(reject)
      return
    }

    let scopes = (args["scopes"] as? [String])?.map { LoginPermission(rawValue: $0) } ?? [.profile]
    let onlyWebLogin = (args["onlyWebLogin"] as? Bool) ?? false
    var parameters: LoginManager.Parameters = LoginManager.Parameters.init()
    
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
            case .success(let value): value.resolver(resolve, reject, name: "login")
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
    if let token = AccessTokenStore.shared.current {
      token.resolver(resolve, reject, name: "access token")
    }else{
      reject("Error getting access token",
             "There isn't an access token available",
             NSError(domain: "", code: 200, userInfo: nil))
    }
  }

  @objc func getProfile(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    API.getProfile { result in
      switch result {
      case .success(let profile): profile.resolver(resolve, reject, name: "profile")
      case .failure(let error): error.rejecter(reject)
      }
    }
  }

  @objc func refreshToken(_ resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
    API.Auth.refreshAccessToken { result in
      switch result {
      case .success(let token): token.resolver(resolve, reject, name: "refresh token")
      case .failure(let error): error.rejecter(reject)
      }
    }
  }

  @objc func verifyAccessToken(_ resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) {
    API.Auth.verifyAccessToken { result in
      switch result {
      case .success(let token): token.resolver(resolve, reject, name: "verify token")
      case .failure(let error): error.rejecter(reject)
      }
    }
  }

  @objc func getBotFriendshipStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                                    rejecter reject: @escaping RCTPromiseRejectBlock) {
    API.getBotFriendshipStatus { result in
      switch result {
      case .success(let status): status.resolver(resolve, reject, name: "bot friendship status")
      case .failure(let error): error.rejecter(reject)
      }
    }
  }

  // Helpers
  static func nilArgument(_ reject: @escaping RCTPromiseRejectBlock) {
    return reject(
      "argument.nil",
      "Expect an argument when invoking method, but it is nil.",
      NSError(domain: "", code: 200, userInfo: nil))
  }

  // Make this code to run on MainQueue. In a separate if false
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

// Extensions

extension Encodable {
  func toJSON() throws -> Any {
    let data = try JSONEncoder().encode(self)
    return try JSONSerialization.jsonObject(with: data, options: [])
  }
  func errorParsing(_ reject: @escaping RCTPromiseRejectBlock, _ name: String) {
    return reject(
      "error parsing",
      "There was an error when parsing `\(name)`",
      NSError(domain: "", code: 200, userInfo: nil))
  }

  func resolver(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock, name: String) {
    do {
      let jsonValue = try self.toJSON()
      resolve(jsonValue)
    } catch {
      self.errorParsing(reject, name)
    }
  }
}

extension LineSDKError {
  func rejecter(_ reject: @escaping RCTPromiseRejectBlock) {
    reject(
      "\(errorCode)",
      errorDescription,
      self)
  }
}
