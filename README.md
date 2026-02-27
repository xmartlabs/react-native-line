# ![React Native Line](/assets/banner.png)

[![npm version](https://img.shields.io/npm/v/@xmartlabs/react-native-line.svg?style=flat-square)](https://www.npmjs.com/package/@xmartlabs/react-native-line)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

LINE SDK wrapper for React Native 🚀

- [LINE SDK v5 for iOS](https://developers.line.biz/en/reference/ios-sdk-swift/), wrapped with [Swift](https://developer.apple.com/swift/).
- [LINE SDK v5 for Android](https://developers.line.biz/en/reference/android-sdk/), wrapped with [Kotlin](https://kotlinlang.org/).

## Requirements

- Android `minSdkVersion` must be `24` or higher.
- iOS `deploymentTarget` must be `15.1` or higher.
- A [LINE developer account](https://developers.line.biz/console/) and a configured channel are required.

> [!IMPORTANT]
> `@xmartlabs/react-native-line` v6 is a TurboModule and **requires the new architecture to be enabled**.
> - To use v6, enable the new architecture in your app (see [how to enable the new architecture](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md)).
> - If you cannot enable the new architecture yet, use `@xmartlabs/react-native-line` v4 instead.

## Installation

### With Expo

1. Install the package:

    ```bash
    npx expo install @xmartlabs/react-native-line
    ```

2. Add the `expo-build-properties` and `@xmartlabs/react-native-line` plugins to your `app.json`:

    ```json
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ],
      "@xmartlabs/react-native-line"
    ]
    ```

### With React Native CLI

1. Install the package:

    ```bash
    npm install @xmartlabs/react-native-line
    # or
    yarn add @xmartlabs/react-native-line
    ```

2. Install the iOS native dependencies:

    ```bash
    cd ios && pod install
    ```

3. Update your `AppDelegate` to forward URL callbacks to the LINE SDK:

    #### Objective-C

    ```objectivec
    #import "react_native_line-Swift.h"

    ...

    - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
    {
      return [LineLogin application:application open:url options:options];
    }
    ```

    #### Swift

    ```swift
    import react_native_line

    ...

    override func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
      return LineLogin.application(application, open: url, options: options)
    }
    ```

4. Add the following entries to your `Info.plist` just before the closing `</dict>` tag ([reference](https://developers.line.biz/en/docs/line-login-sdks/ios-sdk/swift/setting-up-project/#config-infoplist-file)):

    ```xml
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>line3rdp.$(PRODUCT_BUNDLE_IDENTIFIER)</string>
            </array>
        </dict>
    </array>
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>lineauth2</string>
    </array>
    ```

## Migration Guide

See the [Migration Guide](./docs/MIGRATION_GUIDE.md) for upgrade instructions between versions.

## Usage

1. Import the module and any enums you need:

    ```typescript
    import Line, { Scope, BotPrompt } from '@xmartlabs/react-native-line'
    ```

2. Initialize the SDK with the `setup` method. Call this once when your app starts:

    ```typescript
    useEffect(() => {
      Line.setup({ channelId: 'YOUR_CHANNEL_ID' })
    }, [])
    ```

3. Log in with the `login` method:

    ```typescript
    // Default login — requests the profile scope only
    Line.login({})

    // Explicit scopes and bot prompt
    Line.login({
      scopes: [Scope.Profile, Scope.OpenId],
      botPrompt: BotPrompt.Normal,
    })
    ```

## API

### Methods

| Method | Description |
| --- | --- |
| `setup(params: SetupParams): Promise<void>` | Initializes the LINE SDK. Must be called before any other method. |
| `login(params: LoginParams): Promise<LoginResult>` | Starts the LINE login flow. Opens the LINE app if installed, otherwise falls back to the browser. |
| `logout(): Promise<void>` | Revokes the current user's access token and clears the local session. |
| `getCurrentAccessToken(): Promise<AccessToken>` | Returns the locally cached access token for the current user, without a network call. |
| `refreshAccessToken(): Promise<AccessToken>` | Exchanges the current access token for a fresh one. |
| `verifyAccessToken(): Promise<VerifyResult>` | Validates the current access token against the LINE server and returns its metadata. |
| `getProfile(): Promise<UserProfile>` | Returns the current user's LINE profile. Requires `Scope.Profile`. |
| `getFriendshipStatus(): Promise<FriendshipStatus>` | Returns whether the current user has added the channel's linked LINE Official Account as a friend. Requires [bot linkage](https://developers.line.biz/en/docs/line-login/link-a-bot/) to be configured. |

### Types

#### `SetupParams`

| Field | Type | Description |
| --- | --- | --- |
| `channelId` | `string` | Your LINE Login channel ID. |
| `universalLinkUrl` | `string?` | Universal link URL registered for your channel. iOS only. |

#### `LoginParams`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `scopes` | `Scope[]` | `[Scope.Profile]` | OAuth scopes to request. |
| `onlyWebLogin` | `boolean` | `false` | Skip the LINE app and use the browser-based login flow. |
| `botPrompt` | `BotPrompt` | `BotPrompt.Normal` | Controls the bot friend-add prompt shown during login. |

#### `Scope` (enum)

| Value | String | Description |
| --- | --- | --- |
| `Scope.Profile` | `'profile'` | Access to the user's display name, picture URL, status message, and user ID. |
| `Scope.OpenId` | `'openid'` | Issues an OpenID Connect ID token. Required to receive `idToken`. |
| `Scope.Email` | `'email'` | Access to the user's email address. Requires channel approval from LINE. |

#### `BotPrompt` (enum)

| Value | Description |
| --- | --- |
| `BotPrompt.Normal` | Adds an inline "Add friend" option in the consent screen. |
| `BotPrompt.Aggressive` | Shows a standalone friend-add screen after the consent screen. |

#### `AccessToken`

| Field | Type | Description |
| --- | --- | --- |
| `accessToken` | `string` | Bearer token used to authorize LINE API calls. |
| `expiresIn` | `number` | Seconds until the token expires (OAuth standard `expires_in`). |
| `idToken` | `string?` | Raw OpenID Connect ID token. Present only when `Scope.OpenId` was requested. |

#### `LoginResult`

| Field | Type | Description |
| --- | --- | --- |
| `accessToken` | `AccessToken` | The access token issued for this login session. |
| `scope` | `string` | Space-separated list of granted scopes (e.g. `"profile openid"`). |
| `userProfile` | `UserProfile?` | The user's profile. Present only when `Scope.Profile` was requested. |
| `friendshipStatusChanged` | `boolean?` | Whether the user's friendship status with the linked LINE Official Account changed during this login. |
| `idTokenNonce` | `string?` | Nonce for ID token verification. Present only when `Scope.OpenId` was requested. |

#### `UserProfile`

| Field | Type | Description |
| --- | --- | --- |
| `userId` | `string` | The user's LINE user ID. Stable across logins for the same channel. |
| `displayName` | `string` | The user's LINE display name. |
| `pictureUrl` | `string?` | URL of the user's profile picture. |
| `statusMessage` | `string?` | The user's LINE status message. |

#### `FriendshipStatus`

| Field | Type | Description |
| --- | --- | --- |
| `friendFlag` | `boolean` | `true` if the user has added the linked LINE Official Account as a friend. |

#### `VerifyResult`

| Field | Type | Description |
| --- | --- | --- |
| `clientId` | `string` | The channel ID the access token was issued for. |
| `expiresIn` | `number` | Seconds until the token expires. |
| `scope` | `string` | Space-separated list of scopes granted to the token. |

## Example

Check the [example app](/example) for a complete working implementation. To run it locally, navigate to the [example](/example) folder and run `npm install`, then `npm run ios` or `npm run android`.

## License

`@xmartlabs/react-native-line` is available under the MIT license. See the [LICENSE](./LICENSE) file for details.

<p align="center">
  <img src="https://github.com/user-attachments/assets/53fab07a-54f5-4f46-a894-e3476318a68d" alt="Xmartlabs Logo" width="150" />
</p>

<p align="center">
  <b>Created with ❤️ by <a href="https://xmartlabs.com/">Xmartlabs</a></b>
</p>
