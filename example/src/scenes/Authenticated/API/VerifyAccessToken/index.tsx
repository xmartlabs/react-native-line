import Line from '@xmartlabs/react-native-line'
import { InfoList } from 'src/scenes/Authenticated/API/InfoList'

export const VerifyAccessToken = () =>
  InfoList(Line.verifyAccessToken, 'Verify access token')
