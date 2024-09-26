import { displayNotificationForAll } from './notificationDisplayers';

//how to show notifications
export const handleMessage = async (remoteMessage: any) => {
  await displayNotificationForAll(remoteMessage);
};
