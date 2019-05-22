#import "LineLoginManager.h"

static NSString *errorDomain = @"LineLogin";

@implementation LineLoginManager
{
    LineSDKAPI *apiClient;

    RCTPromiseResolveBlock loginResolver;
    RCTPromiseRejectBlock loginRejecter;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

# pragma mark - Module

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(login:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    loginResolver = resolve;
    loginRejecter = reject;

    [self loginWithOptions:nil botPrompt:nil];
}


RCT_EXPORT_METHOD(loginWithPermissions:(NSArray *)permissions
                              resolver:(RCTPromiseResolveBlock)resolve
                              rejecter:(RCTPromiseRejectBlock)reject)
{
    loginResolver = resolve;
    loginRejecter = reject;

    [self loginWithOptions:permissions botPrompt:nil];
}

RCT_EXPORT_METHOD(loginWithOptions:(NSArray *)permissions
                         botPrompt:(NSString *)botPrompt
                         resolver:(RCTPromiseResolveBlock)resolve
                         rejecter:(RCTPromiseRejectBlock)reject)
{
    loginResolver = resolve;
    loginRejecter = reject;

    [self loginWithOptions:permissions botPrompt:botPrompt];
}

RCT_EXPORT_METHOD(currentAccessToken:(RCTPromiseResolveBlock)resolve
                            rejecter:(RCTPromiseRejectBlock)reject)
{
    if([[LineSDKLogin sharedInstance] isAuthorized])
    {
        LineSDKAccessToken *currentAccessToken = [apiClient currentAccessToken];
        resolve([self parseAccessToken:currentAccessToken]);
    } else
    {
        NSError *error = [[NSError alloc] initWithDomain:errorDomain code:1 userInfo:@{ NSLocalizedDescriptionKey:@"User is not logged in!" }];
        reject(nil, nil, error);
    }
}

RCT_EXPORT_METHOD(logout:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject)
{
    [apiClient logoutWithCompletion:^(BOOL success, NSError * _Nullable error) {
        if (success)
        {
            resolve(nil);
        } else
        {
            reject(nil, nil, error);
        }
    }];
}

RCT_EXPORT_METHOD(getUserProfile:(RCTPromiseResolveBlock)resolve
                        rejecter:(RCTPromiseRejectBlock)reject)
{
    [apiClient getProfileWithCompletion:^(LineSDKProfile * _Nullable profile, NSError * _Nullable error) {
        if (error)
        {
            reject(nil, nil, error);
        } else
        {
            resolve([self parseProfile: profile]);
        }
    }];
}

# pragma mark - Lifecycle

- (id) init {
    self = [super init];
    if (self)
    {
        apiClient = [[LineSDKAPI alloc] initWithConfiguration:[LineSDKConfiguration defaultConfig]];
        [LineSDKLogin sharedInstance].delegate = self;
    }
    return self;
}

- (void)loginWithOptions:(NSArray *)permissions
               botPrompt:(NSString *)botPrompt
{
    LineSDKLogin *shared = [LineSDKLogin sharedInstance];

    if (botPrompt != nil)
    {
      if ([botPrompt isEqualToString:@"aggressive"] == YES)
      {
        [LineSDKLogin sharedInstance].botPrompt = LineSDKBotPromptAggressive;
      } else if ([botPrompt isEqualToString:@"normal"] == YES)
      {
        [LineSDKLogin sharedInstance].botPrompt = LineSDKBotPromptNormal;
      } else
      {
        [LineSDKLogin sharedInstance].botPrompt = LineSDKBotPromptNone;
      }
    }

    if ([shared canLoginWithLineApp])
    {
        if (permissions && [permissions count] > 0) {
            [shared startLoginWithPermissions:permissions];
        } else
        {
            [shared startLogin];
        }
    } else
    {
        if (permissions && [permissions count] > 0) {
            [shared startWebLoginWithPermissions:permissions];
        } else
        {
            [shared startWebLogin];
        }
    }
}

#pragma mark - LineSDKLoginDelegate

- (void)didLogin:(LineSDKLogin *)login
      credential:(LineSDKCredential *)credential
         profile:(LineSDKProfile *)profile
           error:(NSError *)error
{
    if (error)
    {
        loginRejecter(nil, nil, error);
    } else
    {
        NSMutableDictionary *result = [NSMutableDictionary new];

        NSDictionary *parsedAccessToken = [self parseAccessToken:[credential accessToken]];
        NSDictionary *parsedProfile = [self parseProfile:profile];

        [result setValue:parsedAccessToken forKey:@"accessToken"];
        [result setValue:parsedProfile forKey:@"profile"];

        loginResolver(result);
    }
}

#pragma mark - Helpers

- (NSDictionary *)parseProfile:(LineSDKProfile *)profile
{
    NSMutableDictionary *result = [NSMutableDictionary new];

    [result setValue:[profile userID] forKey:@"userID"];
    [result setValue:[profile displayName] forKey:@"displayName"];
    [result setValue:[profile statusMessage] forKey:@"statusMessage"];
    if (profile.pictureURL)
    {
        [result setValue:[[profile pictureURL] absoluteString] forKey:@"pictureURL"];
    }

    return result;
}

- (NSDictionary *)parseAccessToken:(LineSDKAccessToken *)accessToken
{
    NSMutableDictionary *result = [NSMutableDictionary new];

    [result setValue:[accessToken accessToken] forKey:@"accessToken"];
    [result setValue:[accessToken estimatedExpiredDate] forKey:@"expirationDate"];

    return result;
}

@end

