# ![React Native LINE](/assets/github-banner.png)

<p align="center">
  Line SDK wrapper for React Native 🚀
</p>

This library includes:

- [LINE SDK v5 for iOS Swift](https://developers.line.biz/en/docs/ios-sdk/swift/overview/), wrapped with [Swift](https://developer.apple.com/swift/).
- [LINE SDK v5 for Android](https://developers.line.biz/en/docs/android-sdk/overview/), wrapped with [Kotlin](https://kotlinlang.org/).

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![NPM Version](https://img.shields.io/npm/v/@xmartlabs/react-native-line.svg?style=flat-square)](https://www.npmjs.com/package/@xmartlabs/react-native-line)

## Requirements

- React native `>=0.61.1`
- iOS 10.0 or later as the development target
- Android `minSdkVersion` set to 17 or higher
- [LINE developer account](https://developers.line.biz/console/) with a channel created.

## Migration from v1.x.x

If you are currently using `react-native-line-sdk` (v1.x.x):

1. Unlink the old library:

```
  react-native unlink react-native-line-sdk
```

2. Remove it from the `package.json`
3. Remove any line sdk's `*.aar` from `android/libs`
4. Remove from `android/app/build.gradle`:

```
repositories {
    flatDir {
        dirs 'libs'
    }
}
```

Finally, follow the installation steps for the new version.

## Installation

First, install the npm package with yarn. _Autolink_ is automatic.

```bash
  yarn add @xmartlabs/react-native-line
```

### iOS Setup

#### Using Objective-C

Inside your `AppDelegate.m`, setup the line sdk by passing the channel id obtained.

1. Add `platform :ios, '10.0'` in `Podfile` line:1
2. Modify your info.plist like it says here [Configuring the Info.plist file](https://developers.line.biz/en/docs/ios-sdk/swift/setting-up-project/#configuring-the-info-plist-file)
3. Change your `AppDelegate.m` to match the following:

```objc
// AppDelegate.m

//
// Import the Library
//
#import "RNLine-Swift.h"

//
// Setup the plugin using your CHANNEL_ID when the app finishes launching
//
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [LineLogin setupWithChannelID:@"YOUR_CHANNEL_ID" universalLinkURL:nil];
}

//
// Handle redirection back to the app from Line
//
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [LineLogin application:app open:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  BOOL handledLine = [LineLogin application:application continue:userActivity restorationHandler:restorationHandler];
  return handledLine;
}
```

#### Using Swift

1. Follow instructions in [Integrating LINE Login with your iOS app](https://developers.line.biz/en/docs/ios-sdk/swift/integrate-line-login/).
2. Change your `AppDelegate.m` to match the following:

```swift
// AppDelegate.swift

//
// Import the Library
//
import LineLogin

//
// Setup the plugin using your CHANNEL_ID when the app finishes launching
//
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    LineLogin.setup(channelID: "YOUR_CHANNEL_ID", universalLinkURL: nil)

    return true
}

//
// Handle redirection back to the app from Line
//
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return LineLogin.application(app, open: url, options: options)
}
```

Don't forget to add `application` function, as line's instructions indicate.

### Android Setup

1. Follow all the configuration steps in [Line's Android integration guide](https://developers.line.biz/en/docs/android-sdk/integrate-line-login/)
2. Add the string `line_channel_id` to your strings file with the the channel id that you have on your line console.

```xml
<string name="line_channel_id" translatable="false">Your channel id here</string>
```

3. Add `minSdkVersion = 17` in `android/build.gradle`
4. In your manifest add `xmlns:tools="http://schemas.android.com/tools"` in your `manifest` tag and also `tools:replace="android:allowBackup"` in your `application` tag

## API

First, require the `LineLogin` module:

```javascript
import LineLogin from '@xmartlabs/react-native-line'
```

Then, you can start using all the functions that are available:

| Function                                                 | Description                                                                                                                                                                                                                        |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `login(args?: LoginArguments): Promise<LoginResult>`     | Starts the login flow of Line's SDK (Opens the apps if it's installed and defaults to the browser otherwise). It accepts the same argumements as the LineSDK, in an object `{ key: value }`, defaults the same way as LineSDK too. |
| `getCurrentAccessToken(): Promise<AccessToken>`          | Returns the current access token for the currently logged in user.                                                                                                                                                                 |
| `getProfile(): Promise<UserProfile>`                     | Returns the profile of the currently logged in user.                                                                                                                                                                               |
| `logout(): Promise<void>`                                | Logs out the currently logged in user.                                                                                                                                                                                             |
| `refreshToken(): Promise<AccessToken>`                   | Refreshes the access token and returns it.                                                                                                                                                                                         |
| `verifyAccessToken(): Promise<AccessTokenVerifyResult>`  | Verifies the access token and returns it.                                                                                                                                                                                          |
| `getBotFriendshipStatus(): Promise<BotFriendshipStatus>` | Gets bot friendship status if [configured](https://developers.line.biz/en/docs/ios-sdk/swift/link-a-bot/).                                                                                                                         |

### Return values

The following objects are returned on the methods described above:

1. UserProfile:

```typescript
{
   /// The user ID of the current authorized user.
  userID: String

  /// The display name of the current authorized user.
  displayName: string

  /// The profile image URL of the current authorized user. `null` if the user has not set a profile
  /// image.
  pictureURL?: string

  /// The status message of the current authorized user. `null` if the user has not set a status message.
  statusMessage?: string
}
```

2. AccessToken:

```typescript
{
   /// The value of the access token.
  access_token: String
  /// The expiration time of the access token. It is calculated using `createdAt` and the validity period
  /// of the access token. This value might not be the actual expiration time because this value depends
  /// on the system time of the device when `createdAt` is determined.
  expires_in: String
  /// The raw string value of the ID token bound to the access token. The value exists only if the access token
  /// is obtained with the `.openID` permission.
  id_token?: String
}
```

3. AccessTokenVerifyResult:

```typescript
{
  // The channel ID bound to the access token.
  client_id: String

  /// The amount of time until the access token expires.
  expires_in: String

  /// Valid permissions of the access token separated by spaces
  scope: String
}
```

4. LoginResult

```typescript
{
   /// The access token obtained by the login process.
  accessToken: AccessToken
  /// The permissions bound to the `accessToken` object by the authorization process. Scope has them separated by spaces
  scope: String
  /// Contains the user profile including the user ID, display name, and so on. The value exists only when the
  /// `.profile` permission is set in the authorization request.
  userProfile?: UserProfile
  /// Indicates that the friendship status between the user and the bot changed during the login. This value is
  /// non-`null` only if the `.botPromptNormal` or `.botPromptAggressive` are specified as part of the
  /// `LoginManagerOption` object when the user logs in. For more information, see Linking a bot with your LINE
  /// Login channel at https://developers.line.me/en/docs/line-login/web/link-a-bot/.
  friendshipStatusChanged?: boolean
  /// The `nonce` value when requesting ID Token during login process. Use this value as a parameter when you
  /// verify the ID Token against the LINE server. This value is `null` if `.openID` permission is not requested.
  IDTokenNonce?: String
}
```

5. BotFriendshipStatus

```typescript
{
  friendFlag: boolean
}
```

### Arguments

1. LoginArguments

```typescript
{
  scopes?: LoginPermission[]
  onlyWebLogin?: boolean
  botPrompt?: BotPrompt
}
```

2. LoginPermission

```typescript
{
  EMAIL = 'email',
  /// The permission to get an ID token in the login response.
  OPEN_ID = 'openid',

  /// The permission to get the user's profile including the user ID, display name, and the profile image
  /// URL in the login response.
  PROFILE = 'profile',
}
```

3. BotPrompt

```typescript
{
  aggressive = 'aggressive',
  normal = 'normal',
}
```

## Usage

1. Login with default values:

```typescript
    try {
        ...
        const loginResult = await Line.login()
        ...
    } catch (error) {
        ...
    }
```

2. Login with arguments:

```typescript
    try {
        ...
        const loginResult = await Line.login({
          scopes: ['email', 'profile'],
          botPrompt: 'normal'
        })
        ...
    } catch (error) {
        ...
    }
```

3. Get user profile:

```typescript
    try {
        ...
        const profile = await Line.getProfile()
        ...
    } catch (error) {
        ...
    }
```

3. Logout

```typescript
    try {
        ...
        await Line.logout()
        ...
    } catch (error) {
        ...
    }
```

## Example

If you want to see `@xmartlabs/react-native-line` in action, just move into the [example](/example) folder and run `yarn ios`/`yarn android`. By seeing its source code, you will have a better understanding of the library usage.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/eb16"><img src="https://avatars0.githubusercontent.com/u/20881388?v=4" width="100px;" alt=""/><br /><sub><b>Emiliano Botti</b></sub></a><br /><a href="https://github.com/eb16/react-native-line/commits?author=eb16" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Joaguirrem"><img src="https://avatars2.githubusercontent.com/u/17858453?v=4" width="100px;" alt=""/><br /><sub><b>Joaquín Aguirre</b></sub></a><br /><a href="https://github.com/eb16/react-native-line/commits?author=Joaguirrem" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/nicoache1"><img src="https://avatars0.githubusercontent.com/u/26419582?v=4" width="100px;" alt=""/><br /><sub><b>Nicolas Hernandez</b></sub></a><br /><a href="https://github.com/eb16/react-native-line/commits?author=nicoache1" title="Code">💻</a> <a href="https://github.com/eb16/react-native-line/pulls?q=is%3Apr+reviewed-by%3Anicoache1" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/santiagofm"><img src="https://avatars0.githubusercontent.com/u/6749415?v=4" width="100px;" alt=""/><br /><sub><b>Santiago Fernández</b></sub></a><br /><a href="#projectManagement-santiagofm" title="Project Management">📆</a> <a href="https://github.com/eb16/react-native-line/pulls?q=is%3Apr+reviewed-by%3Asantiagofm" title="Reviewed Pull Requests">👀</a><a href="https://github.com/eb16/react-native-line/commits?author=santiagofm" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/matir91"><img src="https://avatars2.githubusercontent.com/u/8472881?v=4" width="100px;" alt=""/><br /><sub><b>Matías Irland</b></sub></a><br /><a href="https://github.com/eb16/react-native-line/pulls?q=is%3Apr+reviewed-by%3Amatir91" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

`@xmartlabs/react-native-line` is available under the MIT license. See the LICENCE file for more info.
