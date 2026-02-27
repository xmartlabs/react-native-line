# Migration Guide

## v3 → v4

1. **`setup()` is now required**

   - SDK initialization has moved from native code to JavaScript. Add a `setup()` call when your app starts:

     ```typescript
     useEffect(() => {
         Line.setup({ channelId: 'YOUR_CHANNEL_ID' })
     }, [])
     ```

   Then remove the native setup code:

   - **iOS** — remove the setup call from `AppDelegate`:

     ```swift
     // Swift — remove these lines
     func application(_ application: UIApplication, didFinishLaunchingWithOptions ...) -> Bool {
         LineLogin.setup(channelID: "YOUR_CHANNEL_ID", universalLinkURL: nil)
         ...
     }
     ```

     ```objectivec
     // Objective-C — remove these lines
     - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
         [LineLogin setupWithChannelID:@"YOUR_CHANNEL_ID" universalLinkURL:nil];
         ...
     }
     ```

   - **Android** — remove the channel ID string from your resources:

     ```xml
     <!-- remove this line -->
     <string name="line_channel_id" translatable="false">YOUR_CHANNEL_ID</string>
     ```

2. **Renamed methods**

   | Before | After |
   | --- | --- |
   | `getBotFriendshipStatus()` | `getFriendshipStatus()` |
   | `refreshToken()` | `refreshAccessToken()` |

---

## v4 → v5

> [!IMPORTANT]
> v5 is a TurboModule and **requires the new architecture**. Enable it in your app before upgrading — see [how to enable the new architecture](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md).
> If you cannot enable the new architecture yet, stay on v4.

1. **iOS header rename**

   Update the import in your `AppDelegate`:

   ```objectivec
   - #import "RNLine-Swift.h"
   + #import "react_native_line-Swift.h"
   ```

2. **`login()` requires an argument**

   Pass an empty object when using default options:

   ```typescript
   - Line.login()
   + Line.login({})
   ```

---

## v5 → v6

> [!NOTE]
> v6 continues to require the new architecture. No changes needed if you already enabled it for v5.

1. **`LoginPermission` renamed to `Scope`**

   The `LoginPermission` enum has been renamed to `Scope` to align with OAuth 2.0 terminology.

   ```typescript
   - import { LoginPermission } from '@xmartlabs/react-native-line'
   + import { Scope } from '@xmartlabs/react-native-line'

   - Line.login({ scopes: [LoginPermission.Profile, LoginPermission.OpenId] })
   + Line.login({ scopes: [Scope.Profile, Scope.OpenId] })
   ```

   The underlying string values are unchanged (`'profile'`, `'openid'`, `'email'`), so any code that passes raw strings is unaffected.

2. **`expiresIn` is now a `number`**

   `AccessToken.expiresIn` and `VerifyResult.expiresIn` are now typed as `number` (seconds until expiry) instead of `string`.

   ```typescript
   - const secondsLeft = parseInt(token.expiresIn, 10)
   + const secondsLeft = token.expiresIn
   ```
