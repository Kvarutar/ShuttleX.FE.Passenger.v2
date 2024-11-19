import notifee from '@notifee/react-native';

import { store } from '../../redux/store';
import { addFinishedTrips, setTripStatus } from '../../ride/redux/trip';
import { fetchContractorInfo } from '../../ride/redux/trip/thunks';
import { TripStatus } from '../../ride/redux/trip/types';
import { NotificationPayload, NotificationType, NotificationWithPayload, RemoteMessage } from './notificationTypes';

//display notiff without buttons

const isValidNotificationType = (key: string): key is NotificationType => {
  return Object.values(NotificationType).includes(key as NotificationType);
};

const requiresPayload = (type: NotificationType): type is NotificationWithPayload => {
  return [NotificationType.DriverAccepted, NotificationType.WinnerFounded].includes(type);
};

const notificationHandlers: Record<NotificationType, (payload?: NotificationPayload) => Promise<void>> = {
  [NotificationType.DriverAccepted]: async payload => {
    if (payload?.orderId) {
      await store.dispatch(fetchContractorInfo(payload.orderId));
      store.dispatch(setTripStatus(TripStatus.Accepted));
    }
  },
  [NotificationType.TripEnded]: async () => {
    store.dispatch(addFinishedTrips());
    store.dispatch(setTripStatus(TripStatus.Idle));
  },
  [NotificationType.WinnerFounded]: async payload => {
    if (payload?.prizeId) {
      console.log(payload.prizeId);
      // TODO: add handler to redux
    }
  },
  [NotificationType.NoAvailableDrivers]: async () => {
    // TODO: Get to know what to do then
    store.dispatch(setTripStatus(TripStatus.Idle));
  },
  [NotificationType.DriverArrived]: async () => {
    store.dispatch(setTripStatus(TripStatus.Arrived));
  },
  [NotificationType.DriverRejected]: async () => {
    // TODO: Get to know what to do then
    store.dispatch(setTripStatus(TripStatus.Idle));
  },
  [NotificationType.TripStarted]: async () => {
    store.dispatch(setTripStatus(TripStatus.Ride));
  },
};

export const displayNotificationForAll = async (remoteMessage: RemoteMessage) => {
  const { key, payload, title, body } = remoteMessage.data;

  if (!isValidNotificationType(key)) {
    console.error(`Invalid notification type: ${key}`);
    return;
  }

  try {
    let payloadData: NotificationPayload | undefined;

    if (payload && requiresPayload(key)) {
      payloadData = JSON.parse(payload);
    }

    await notificationHandlers[key](payloadData);

    await notifee.displayNotification({
      title,
      body,
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
  } catch (error) {
    console.error('Error processing notification:', error);
  }
};
