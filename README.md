# ![React Native Line](/assets/github-banner.png)

[![npm version](https://img.shields.io/npm/v/@xmartlabs/react-native-line.svg?style=flat-square)](https://www.npmjs.com/package/@xmartlabs/react-native-line)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Line SDK wrapper for React Native 🚀

- [LINE SDK v5 for iOS](https://developers.line.biz/en/reference/ios-sdk-swift/), wrapped with [Swift](https://developer.apple.com/swift/).
- [LINE SDK v5 for Android](https://developers.line.biz/en/reference/android-sdk/), wrapped with [Kotlin](https://kotlinlang.org/).

## Requirements

- Android `minSdkVersion` needs to be at least version `24`.
- iOS `deploymentTarget` needs to be at least version `15.1`.
- [LINE developer account](https://developers.line.biz/console/) with a channel created.

## Installation

### With Expo

1. Install the JavaScript with:

    ```bash
    npx expo install @xmartlabs/react-native-line
    ```

2. Add the plugin `expo-build-properties` to your `app.json`:

    ```json
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static" // This is required
          }
        }
      ]
    ]
    ```

### With react-native-cli

1. Install library:

    ```bash
    npm install @xmartlabs/react-native-line

    # --- or ---

    yarn add @xmartlabs/react-native-line
    ```

2. Link native code:

    ```bash
    cd ios && pod install
    ```

## Usage

1. Import the `LineLogin` module:

    ```typescript
    import LineLogin from '@xmartlabs/react-native-line'
    ```

2. Initialize the module with the `setup` method:

    ```typescript
    useEffect(() => {
      LineLogin.setup('YOUR_CHANNEL_ID')
    }, [])
    ```

3. Login with the `login` method:

    ```typescript
    LineLogin.login({})
    ```

## API

| Function                                                 | Description                                                                                                                                                                                                                        |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `login(args?: LoginArguments): Promise<LoginResult>`     | Starts the login flow of Line's SDK (Opens the apps if it's installed and defaults to the browser otherwise). It accepts the same argumements as the LineSDK, in an object `{ key: value }`, defaults the same way as LineSDK too. |
| `getCurrentAccessToken(): Promise<AccessToken>`          | Returns the current access token for the currently logged in user.                                                                                                                                                                 |
| `getProfile(): Promise<UserProfile>`                     | Returns the profile of the currently logged in user.                                                                                                                                                                               |
| `logout(): Promise<void>`                                | Logs out the currently logged in user.                                                                                                                                                                                             |
| `refreshToken(): Promise<AccessToken>`                   | Refreshes the access token and returns it.                                                                                                                                                                                         |
| `verifyAccessToken(): Promise<AccessTokenVerifyResult>`  | Verifies the access token and returns it.                                                                                                                                                                                          |
| `getBotFriendshipStatus(): Promise<BotFriendshipStatus>` | Gets bot friendship status if [configured](https://developers.line.biz/en/docs/ios-sdk/swift/link-a-bot/).                                                                                                                         |

## Example

If you want to see `@xmartlabs/react-native-line` in action, just move into the [example](/example) folder and run `npm install` and then `npm run ios`/`npm run android`. By seeing its source code, you will have a better understanding of the library usage.

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
