//
//  LineLogin.m
//  RNLine
//
//  Created by Emiliano Botti on 9/25/19.
//  Copyright © 2019 XmartLabs S.R.L.. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(LineLogin, NSObject)
  RCT_EXTERN_METHOD(login: (NSDictionary *)arguments
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
  RCT_EXTERN_METHOD(logout: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
  RCT_EXTERN_METHOD(
                  getBotFriendshipStatus: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
  RCT_EXTERN_METHOD(getCurrentAccessToken: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
  RCT_EXTERN_METHOD(
                  getProfile: (RCTPromiseResolveBlock)resolve
                        rejecter: (RCTPromiseRejectBlock)reject
                  )
  RCT_EXTERN_METHOD(
                  refreshToken: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
  RCT_EXTERN_METHOD(
                  verifyAccessToken: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
  RCT_EXTERN_METHOD(
                  configure: (NSDictionary *)arguments
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
@end
