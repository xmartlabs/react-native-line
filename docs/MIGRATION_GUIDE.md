# Migration guides

## v3 → v4

1. A `setup` function has been added and needs to be called before using the library.
    ```typescript
    Line.setup({ channelId: 'YOUR_CHANNEL_ID' })
    ```

2. The `getBotFriendshipStatus` function is now called `getFriendshipStatus`.

3. The `refreshToken` function is now called `refreshAccessToken`.

4. Remove the function `application` from `AppDelegate`:
    #### With Swift
    ```swift
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        LineLogin.setup(channelID: "YOUR_CHANNEL_ID", universalLinkURL: nil)
        return true
    }
    ```

    #### With Objective-C
    ```objectivec
    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    {
        [LineLogin setupWithChannelID:@"YOUR_CHANNEL_ID" universalLinkURL:nil];
    }
    ```

5. Remove the string `line_channel_id` from Android resources:
    ```xml
    <string name="line_channel_id" translatable="false">YOUR_CHANNEL_ID</string>
    ```

## v4 → v5

1. The file name in the `AppDelegate` import has changed.
    ```objectivec
    - #import "RNLine-Swift.h"

    + #import "react_native_line-Swift.h"
    ```

2. The `login` function now expects an empty object as a default value.
    ```typescript
    - Line.login()

    + Line.login({})
    ```
