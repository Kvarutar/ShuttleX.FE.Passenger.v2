import notifee from '@notifee/react-native';

import { RemoteMessage } from './notificationTypes';

//display notiff without buttons
export const displayNotificationForAll = async (remoteMessage: RemoteMessage) => {
  await notifee.displayNotification({
    title: `<p><b>${remoteMessage.data.title}</span></p></b></p>`,
    body: remoteMessage.data.body,

    android: {
      channelId: 'general-channel',
      smallIcon: 'bootsplash_logo',
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
};
