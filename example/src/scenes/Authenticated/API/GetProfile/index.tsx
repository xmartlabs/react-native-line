import Line from '@xmartlabs/react-native-line'
import { InfoList } from 'src/scenes/Authenticated/API/InfoList'

export const GetProfile = () => InfoList(Line.getProfile, 'User')
