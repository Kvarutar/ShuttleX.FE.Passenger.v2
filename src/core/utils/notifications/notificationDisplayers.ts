import notifee from '@notifee/react-native';

import { store } from '../../redux/store';
import { setOrderStatus } from '../../ride/redux/order';
import { OrderStatus } from '../../ride/redux/order/types';
import { addFinishedTrips, endTrip, setTripStatus } from '../../ride/redux/trip';
import { getContractorInfo, getRouteInfo } from '../../ride/redux/trip/thunks';
import { TripStatus } from '../../ride/redux/trip/types';
import { NotificationPayload, NotificationRemoteMessage, NotificationType, NotificationWithPayload } from './types';

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
      await store.dispatch(getContractorInfo(payload.orderId));
      await store.dispatch(getRouteInfo(payload.orderId));
      store.dispatch(setTripStatus(TripStatus.Accepted));
    }
  },
  [NotificationType.TripEnded]: async () => {
    store.dispatch(addFinishedTrips());
    //TODO go to rating page
    store.dispatch(setTripStatus(TripStatus.Finished));
    store.dispatch(endTrip());
  },
  [NotificationType.WinnerFounded]: async payload => {
    if (payload?.prizeId) {
      console.log(payload.prizeId);
      // TODO: add handler to redux
    }
  },
  [NotificationType.DriverArrived]: async () => {
    store.dispatch(setTripStatus(TripStatus.Arrived));
  },
  [NotificationType.DriverRejected]: async () => {
    // TODO: Get to searching screen again, what next??? Add logic later
    store.dispatch(endTrip());
    store.dispatch(setOrderStatus(OrderStatus.Confirming));
  },
  [NotificationType.TripStarted]: async () => {
    store.dispatch(setTripStatus(TripStatus.Ride));
  },
};

export const displayNotificationForAll = async (remoteMessage: NotificationRemoteMessage) => {
  const { key, payload, title, body } = remoteMessage.data;
  console.log('displayNotificationForAll', remoteMessage);

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
        // smallIcon: 'ic_launcher',
        //@mipmap/ic_launcher
        //TODO test icon
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
