#ifndef RCT_NEW_ARCH_ENABLED
#error "@xmartlabs/react-native-line v5 requires your project to have NEW ARCHITECTURE ENABLED. Use v4 if you want to keep using the old architecture."
#endif

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "RTNLineSpec.h"

@interface RCT_EXTERN_MODULE(LineLogin, NSObject)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLineLoginSpecJSI>(params);
}

RCT_EXTERN_METHOD(setup: (NSDictionary *)arguments resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(login: (NSDictionary *)arguments resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(logout: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getFriendshipStatus: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getCurrentAccessToken: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getProfile: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(refreshAccessToken: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(verifyAccessToken: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)

@end
