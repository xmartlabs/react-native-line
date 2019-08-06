# React native LINE
iOS and Android Native wrapper for LINE Mobile SDK.

## Requirements
- React native `0.48.+`.
- LineSDK iOS `5.0.0` and Android `5.0.1`.

## Installation
First, install the npm package and link it to your Android and iOS projects with react-native link.
```bash
  npm install react-native-line-sdk
  react-native link react-native-line-sdk
```
### iOS Setup
1. Follow all the configuration steps in [LINE Login iOS integration guide](https://developers.line.biz/en/docs/ios-sdk/objective-c/setting-up-project/)
2. In the `Downloading the SDK` section of the official integration guide:
- If you download the Line SDK via Cocoapods, this npm package should be integrated fine after you follow the integration guide
- If you manually download the Line SDK ( according the sub section `Download from the "Downloads" page` ), before linking the SDK files via Xcode, be sure place the SDK files `LineSDKResource.bundle` and `LineSDK.framework` inside the folder path `${YOUR_RN_PROJECT}/ios/Frameworks`

### Android Setup
1. Follow all the configuration steps in [LINE Login Android integration guide](https://developers.line.biz/en/docs/android-sdk/integrate-line-login/)
2. Add the string `line_channel_id` to your `strings.xml` file on `android/app/src/main/res/values` folder with the the channel id that you have on your line console.
```xml
<string name="line_channel_id" translatable="false">Your channel id here</string>
```
3. Download the line Android SDK [here](https://developers.line.me/en/docs/line-login/downloads/) and 
save it on a new folder named `libs` under your `app` folder on your android project 
or you can go to `node_modules/react-native-line-sdk/android/libs` and copy `aar` files to your `libs` folder on `android/app/libs`

4. Add the following to your app's build.gradle:
```gradle
repositories {
    flatDir {
        dirs 'libs'
    }
}
```
5. Add the following dependencies to your app's build.gradle:
```gradle
implementation('com.madgag.spongycastle:prov:1.58.0.0') {
  exclude group: 'junit', module: 'junit'
}
api 'io.jsonwebtoken:jjwt-api:0.10.5'
runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.10.5'
runtimeOnly ('io.jsonwebtoken:jjwt-orgjson:0.10.5') {
  exclude group: 'org.json', module: 'json' //provided by Android natively
}
```

## Usage
First, require the `LineLogin` module:
```javascript
import LineLogin from 'react-native-line-sdk'
```
Then, you can start using all the functions that are available:

#### login

`login = () => Promise<{Profile, AccessToken}>`

Starts the login flow of LINE SDK, if user has installed LINE app, it will open it otherwise it will open browser or in-app browser)

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

#### loginWithPermission

`loginWithPermissions = (permissions) => Promise<{Profile, AccessToken, Email}>`

The login flow same with `login()` but you need to pass the permission (or scope). There are three scope you can send:
1. `profile`: Permission to get the user's profile information.
2. `openid`: Used to retrieve an ID token
3. `email`: Permission to get the user's email address. openid must be specified at the same time.

More info: [LINE Login integration web-app (see Scope section)](https://developers.line.biz/en/docs/line-login/web/integrate-line-login/#spy-making-an-authorization-request)

Example:
```javascript
  LineLogin.loginWithPermissions(['profile', 'openid', 'email'])
    .then(user => {
      console.log('accessToken',user.accessToken.accessToken);
      console.log('email',user.email);
      console.log('profile',user.profile);
    })
    .catch(err => {
      console.log(err);
    });
};
```

Starts the login 

3. `currentAccessToken = () => Promise<AccessToken>`: Returns the current access token for the currently logged in user.

4. `getUserProfile = () => Promise<Profile>`: Returns the profile of the currently logged in user.

5. `logout = () => Promise<Void>`: Logs out the currently logged in user.

### Return values
The following objects are returned on the methods described above:
```json
{
  "accessToken": {
    "expirationDate": "2592000000",
    "accessToken": "some token"
  },
  "profile": {
    "pictureURL": "profile picture url",
    "statusMessage": "user status messaage",
    "userID": "user id",
    "displayName": "user displayed name"
  },
  "email": "user email"
}
```

## Example
To see more of `react-native-line-sdk` in action you can check out the source in the `example` folder.

## Authors
- [Santiago Fernandez](https://github.com/santiagofm)
- [Mauricio Cousillas](https://github.com/mcousillas6)

## License
`react-native-line-sdk` is available under the MIT license. See the LICENCE file for more info.
