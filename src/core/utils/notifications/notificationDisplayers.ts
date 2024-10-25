import notifee from '@notifee/react-native';

import { store } from '../../redux/store';
import { addFinishedTrips } from '../../ride/redux/trip';
import { fetchContractorInfo } from '../../ride/redux/trip/thunks';
import { RemoteMessage } from './notificationTypes';

//display notiff without buttons
type NotificationTitle =
  | 'driver_accepted'
  | 'no_availible_drivers'
  | 'trip_started'
  | 'trip_ended'
  | 'driver_arrived'
  | 'driver_rejected';

function isNotificationTitle(key: string): key is NotificationTitle {
  return [
    'driver_accepted',
    'no_availible_drivers',
    'trip_started',
    'trip_ended',
    'driver_arrived',
    'driver_rejected',
  ].includes(key);
}

export const displayNotificationForAll = async (remoteMessage: RemoteMessage) => {
  const { key, payload } = remoteMessage.data;

  const { OrderId } = JSON.parse(payload.OrderId);

  if (isNotificationTitle(key)) {
    store.dispatch(fetchContractorInfo(OrderId));
  }
  if (key === 'trip_ended') {
    store.dispatch(addFinishedTrips());
  }

  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,

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
