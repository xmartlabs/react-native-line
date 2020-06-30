import Line from 'react-native-line'
import { InfoList } from 'src/scenes/Authenticated/API/InfoList'

export const GetCurrentAccessToken = () =>
  InfoList(Line.getCurrentAccessToken, 'Access Token')
