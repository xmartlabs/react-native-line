# React native LINE
iOS and Android Native wrapper for Line's MobileSDK.

## Requirements
- React native `0.48.+`.
- LineSDK iOS `5.0.0` and Android `4.0.8`.

## Installation
First, install the npm package and link it to your Android and iOS projects with react-native link.
```bash
  npm install react-native-line-sdk
  react-native link react-native-line-sdk
```
### iOS Setup
Follow all the configuration steps in [Line's iOS integration guide](https://developers.line.me/en/docs/line-login/ios/integrate-line-login/)

### Android Setup
1. Follow all the configuration steps in [Line's Android integration guide](https://developers.line.me/en/docs/line-login/android/integrate-line-login/)
2. Add the string `line_channel_id` to your strings file with the the channel id that you have on your line console.
```xml
<string name="line_channel_id" translatable="false">Your channel id here</string>
```
3. Download the line Android SDK [here](https://developers.line.me/en/docs/line-login/downloads/) and save it on a new folder named `libs` under your `app` folder on your android project.
4. Add the following to your app's build.gradle:
```gradle
repositories {
    flatDir {
        dirs 'libs'
    }
}
```

## Usage
First, require the `LineLogin` module:
```javascript
import LineLogin from 'react-native-line-sdk'
```
Then, you can start using all the functions that are available:

1. `login = () => Promise<{Profile, AccessToken}>`: Starts the login flow of Line's SDK (Opens the apps if it's installed and defaults to the browser otherwise.)`

2. `loginWithPermissions = (permissions) => Promise<{Profile, AccessToken}>`: **iOS ONLY** Works as the `login` function but you can provide custom permissions settings.

3. `currentAccessToken = () => Promise<AccessToken>`: Returns the current access token for the currently logged in user.

4. `getUserProfile = () => Promise<Profile>`: Returns the profile of the currently logged in user.

5. `logout = () => Promise<Void>`: Logs out the currently logged in user.

Example:
```javascript
  LineLogin.login()
    .then((user) => {
      console.log(user.profile.displayName)
    })
    .catch((err) => {
      console.log(err)
    })
```

### Return values
The following objects are returned on the methods described above:
1. Profile:
```typescript
{
  displayName: String,
  userID: String,
  statusMessage: String,
  pictureURL: String?,
}
```
2. AccessToken:
```typescript
{
  accessToken: String,
  expirationDate: String,
}
```

## Example
To see more of `react-native-line-sdk` in action you can check out the source in the `example` folder.

## Authors
- [Santiago Fernandez](https://github.com/santiagofm)
- [Mauricio Cousillas](https://github.com/mcousillas6)

## License
`react-native-line-sdk` is available under the MIT license. See the LICENCE file for more info.
