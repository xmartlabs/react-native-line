# Migration guides

## v3 → v4

1. A `setup` function has been added and needs to be called before using the library.
    ```typescript
    Line.setup({ channelId: 'YOUR_CHANNEL_ID' })
    ```

2. The `getBotFriendshipStatus` function is now called `getFriendshipStatus`.

3. The `refreshToken` function is now called `refreshAccessToken`.

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
