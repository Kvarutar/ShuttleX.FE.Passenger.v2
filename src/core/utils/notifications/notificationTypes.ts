import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export interface RemoteMessage extends FirebaseMessagingTypes.RemoteMessage {
  data: {
    title?: string;
    body?: string;
  };
}
