import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import { sendFirebaseToken } from '../../notificator/thunks';
import { store } from '../../redux/store';
import { requestNotificationsPermission } from '../permissions';
import { handleMessage } from './notificationHandlers';

//main func
export const setupNotifications = async () => {
  await requestNotificationsPermission();
  await createChannels();
  setupTokenRefresh();
  subscribeToMessages();
};

//channels
const createChannels = async () => {
  await notifee.createChannel({
    id: 'general-channel',
    name: 'General Channel',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
  });
};

//set notif for background and foreground
const subscribeToMessages = () => {
  messaging().setBackgroundMessageHandler(handleMessage);
  messaging().onMessage(handleMessage);
};

export const getDeviceToken = async () => {
  try {
    const token = await messaging().getToken();
    //TODO delete console after all tests
    console.log('token:', token);

    store.dispatch(sendFirebaseToken(token));
  } catch (error) {
    console.error('Cant get token:', error);
  }
};

// Refresh token
const setupTokenRefresh = async () => {
  messaging().onTokenRefresh(async newToken => {
    store.dispatch(sendFirebaseToken(newToken));
  });
};
