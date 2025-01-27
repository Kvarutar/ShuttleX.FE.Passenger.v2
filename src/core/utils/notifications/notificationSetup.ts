import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import { logger } from '../../../App';
import { sendFirebaseToken } from '../../notificator/thunks';
import { store } from '../../redux/store';
import { requestNotificationsPermission } from '../permissions';
import { notificationHandlers } from './notificationDisplayers';
import { handleMessage } from './notificationHandlers';
import { SSEAndNotificationsEventType } from './types';

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
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    //for test
    console.log('remoteMessage on background', remoteMessage);
  });
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

// if app was killed and user tap on notif
export const checkInitialNotification = async () => {
  const initialNotification = await messaging().getInitialNotification();

  const isSSEAndNotificationsEventType = (key: any): key is SSEAndNotificationsEventType => {
    return typeof key === 'string' && key in notificationHandlers;
  };

  if (initialNotification) {
    const key = initialNotification.data?.key;
    const payload = initialNotification.data?.payload;

    if (key && payload && isSSEAndNotificationsEventType(key) && typeof payload === 'string') {
      const payloadData = JSON.parse(payload);
      notificationHandlers[key](payloadData);
    }
  }
};
