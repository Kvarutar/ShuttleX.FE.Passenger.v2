import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import { logger } from '../../../App';
import { sendFirebaseToken } from '../../notificator/thunks';
import { store } from '../../redux/store';
import { requestNotificationsPermission } from '../permissions';
import { handleMessage } from './notificationHandlers';

//main func
export const setupNotifications = async () => {
  await requestNotificationsPermission();
  await createChannels();
  setupFirebaseRefreshToken();
  subscribeToMessages();
};

//channels
const createChannels = async () => {
  await notifee.createChannel({
    id: 'general',
    name: 'General Channel',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
    vibration: true,
  });
};

//set notif for background and foreground
const subscribeToMessages = () => {
  messaging().setBackgroundMessageHandler(handleMessage);
  messaging().onMessage(handleMessage);
};

export const getFirebaseDeviceToken = async () => {
  try {
    const token = await messaging().getToken();
    //TODO delete console after all tests
    console.log('Firebase Token:', token);

    store.dispatch(sendFirebaseToken(token));
  } catch (error) {
    logger.error('Cannot get firebase device token:', error);
  }
};

// Refresh token
const setupFirebaseRefreshToken = async () => {
  messaging().onTokenRefresh(async newToken => {
    store.dispatch(sendFirebaseToken(newToken));
  });
};
