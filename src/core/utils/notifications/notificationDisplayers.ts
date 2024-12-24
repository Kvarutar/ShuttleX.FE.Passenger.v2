import notifee, { AndroidColor } from '@notifee/react-native';

import { setWinnerPrizes } from '../../lottery/redux';
import { getTicketAfterRide } from '../../lottery/redux/thunks';
import { store } from '../../redux/store';
import { createInitialOffer } from '../../ride/redux/offer/thunks';
import { setOrderStatus } from '../../ride/redux/order';
import { orderStatusSelector } from '../../ride/redux/order/selectors';
import { OrderStatus } from '../../ride/redux/order/types';
import { addFinishedTrips, endTrip, setTripIsCanceled, setTripStatus } from '../../ride/redux/trip';
import { orderInfoSelector, tripStatusSelector } from '../../ride/redux/trip/selectors';
import { getCurrentOrder, getOrderInfo, getRouteInfo } from '../../ride/redux/trip/thunks';
import { TripStatus } from '../../ride/redux/trip/types';
import { NotificationPayload, NotificationRemoteMessage, NotificationType } from './types';

//display notiff without buttons
const isValidNotificationType = (key: string): key is NotificationType => {
  return Object.values(NotificationType).includes(key as NotificationType);
};

const notificationHandlers: Record<NotificationType, (payload: NotificationPayload | undefined) => Promise<void>> = {
  [NotificationType.DriverAccepted]: async payload => {
    const tripStatus = tripStatusSelector(store.getState());

    //Check trip status because longpolling can get information earlier
    if (payload?.orderId && tripStatus !== TripStatus.Accepted) {
      await store.dispatch(getOrderInfo(payload.orderId));
      await store.dispatch(getRouteInfo(payload.orderId));
      store.dispatch(setTripStatus(TripStatus.Accepted));
    }
  },
  [NotificationType.TripEnded]: async () => {
    const tripStatus = tripStatusSelector(store.getState());

    if (tripStatus !== TripStatus.Finished) {
      store.dispatch(addFinishedTrips());
      //TODO go to rating page
      store.dispatch(getTicketAfterRide());
      store.dispatch(setTripStatus(TripStatus.Finished));
    }
  },
  [NotificationType.WinnerFounded]: async payload => {
    if (payload?.prizeIds && payload.ticketNumber) {
      store.dispatch(
        setWinnerPrizes({
          ticket: payload.ticketNumber,
          prizeIds: payload.prizeIds,
        }),
      );
    }
  },
  [NotificationType.DriverArrived]: async () => {
    const tripStatus = tripStatusSelector(store.getState());
    if (tripStatus !== TripStatus.Arrived) {
      store.dispatch(getCurrentOrder());
    }
  },

  // BeforePickup when trip doesnt start and driver rejected - go to search driver again
  [NotificationType.DriverCanceled]: async () => {
    const orderStatus = orderStatusSelector(store.getState());

    if (orderStatus !== OrderStatus.Confirming) {
      store.dispatch(endTrip());
      store.dispatch(createInitialOffer());
      store.dispatch(setOrderStatus(OrderStatus.Confirming));
    }
  },

  //AfterPickUp when trip started and driver canceled trip - go to receipt screen
  [NotificationType.DriverRejected]: async () => {
    store.dispatch(setTripIsCanceled(true));
    const orderInfo = orderInfoSelector(store.getState());
    const tripStatus = tripStatusSelector(store.getState());

    if (tripStatus !== TripStatus.Finished) {
      if (orderInfo) {
        store.dispatch(getOrderInfo(orderInfo.orderId));
      }
      store.dispatch(setTripStatus(TripStatus.Finished));
    }
  },

  [NotificationType.TripStarted]: async () => {
    const tripStatus = tripStatusSelector(store.getState());
    if (tripStatus !== TripStatus.Ride) {
      store.dispatch(getCurrentOrder());
    }
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

    if (payload) {
      try {
        payloadData = JSON.parse(payload);
      } catch (parseError) {
        console.error(`Error parsing payload of notification ${remoteMessage}:`);
      }
    }

    await notificationHandlers[key](payloadData);

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'general-channel',
        color: AndroidColor.LIME,
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',
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
