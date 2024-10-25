import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { getNotificationToken } from 'shuttlex-integration';

import { requestNotificationsPermission } from '../permissions';
import { handleMessage } from './notificationHandlers';

//main func
export const setupNotifications = async () => {
  await requestNotificationsPermission();
  await createChannels();
  getNotificationToken();
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

const setupTokenRefresh = () => {
  messaging().onTokenRefresh(async newToken => {
    console.log('Refreshed token:', newToken);
    //TODO Send refreshed token to backend
  });
};
