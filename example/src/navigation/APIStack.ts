import { createStackNavigator } from 'react-navigation-stack'
import { Route } from './Route'
import { API } from 'src/scenes/Authenticated/API'
import { GetProfile } from 'src/scenes/Authenticated/API/GetProfile'
import { GetCurrentAccessToken } from 'src/scenes/Authenticated/API/GetCurrentAccessToken'
import { VerifyAccessToken } from 'src/scenes/Authenticated/API/VerifyAccessToken'
import { RefreshToken } from 'src/scenes/Authenticated/API/RefreshToken'

export const APIStack = createStackNavigator(
  {
    [Route.API]: API,
    [Route.API_GetProfile]: GetProfile,
    [Route.API_GetCurrentAccessToken]: GetCurrentAccessToken,
    [Route.API_VerifyAccessToken]: VerifyAccessToken,
    [Route.API_RefreshToken]: RefreshToken,
  },
  {
    initialRouteName: Route.API,
  },
)
