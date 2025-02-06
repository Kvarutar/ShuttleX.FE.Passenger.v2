import notifee, { AndroidColor } from '@notifee/react-native';
import { isCoordinatesEqualZero } from 'shuttlex-integration';

import { logger } from '../../../App';
import { setWinnerPrizes } from '../../lottery/redux';
import { getTicketAfterRide } from '../../lottery/redux/thunks';
import { store } from '../../redux/store';
import { offerSelector } from '../../ride/redux/offer/selectors';
import { createInitialOffer, getRecentDropoffs } from '../../ride/redux/offer/thunks';
import { setOrderStatus } from '../../ride/redux/order';
import { OrderStatus } from '../../ride/redux/order/types';
import {
  addFinishedTrips,
  endTrip,
  setIsOrderCanceled,
  setIsOrderCanceledAlertVisible,
  setSelectedOrderId,
  setTripIsCanceled,
  setTripStatus,
} from '../../ride/redux/trip';
import {
  isOrderCanceledSelector,
  orderInfoSelector,
  selectedOrderIdSelector,
  tripStatusSelector,
} from '../../ride/redux/trip/selectors';
import { getCurrentOrder, getOrderInfo, getRouteInfo } from '../../ride/redux/trip/thunks';
import { TripStatus } from '../../ride/redux/trip/types';
import { NotificationPayload, NotificationRemoteMessage, SSEAndNotificationsEventType } from './types';

//display notiff without buttons
const isValidNotificationType = (key: string): key is SSEAndNotificationsEventType => {
  return Object.values(SSEAndNotificationsEventType).includes(key as SSEAndNotificationsEventType);
};

export const notificationHandlers: Record<
  SSEAndNotificationsEventType,
  (payload: NotificationPayload | undefined) => Promise<void>
> = {
  [SSEAndNotificationsEventType.DriverAccepted]: async payload => {
    const tripStatus = tripStatusSelector(store.getState());

    //Check trip status because sse can get information earlier
    if (payload?.orderId && tripStatus !== TripStatus.Accepted) {
      await store.dispatch(getOrderInfo(payload.orderId));
      await store.dispatch(getRouteInfo(payload.orderId));
      store.dispatch(setTripStatus(TripStatus.Accepted));
      store.dispatch(setIsOrderCanceled(false));
      store.dispatch(setSelectedOrderId(payload.orderId));
    }
  },
  [SSEAndNotificationsEventType.TripEnded]: async () => {
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());
    const orderInfo = orderInfoSelector(store.getState());

    if (orderInfo?.orderId === selectedOrderId && tripStatus !== TripStatus.Finished) {
      store.dispatch(addFinishedTrips());
      //TODO go to rating page
      store.dispatch(getTicketAfterRide());
      store.dispatch(setTripStatus(TripStatus.Finished));
      store.dispatch(getRecentDropoffs({ amount: 10 }));
    }
  },
  [SSEAndNotificationsEventType.WinnerFounded]: async payload => {
    if (payload?.prizeIds && payload.ticketNumber) {
      store.dispatch(
        setWinnerPrizes({
          ticket: payload.ticketNumber,
          prizeIds: payload.prizeIds,
        }),
      );
    }
  },
  [SSEAndNotificationsEventType.DriverArrived]: async () => {
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());
    const orderInfo = orderInfoSelector(store.getState());

    if (tripStatus !== TripStatus.Arrived && orderInfo?.orderId === selectedOrderId) {
      store.dispatch(getCurrentOrder());
    }
  },

  // BeforePickup when trip doesnt start and driver rejected - go to search driver again
  [SSEAndNotificationsEventType.DriverCanceled]: async () => {
    const isOrderCanceled = isOrderCanceledSelector(store.getState());
    const offer = offerSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());
    const orderInfo = orderInfoSelector(store.getState());

    //Because it can be changed in sse
    if (orderInfo?.orderId === selectedOrderId && !isOrderCanceled) {
      store.dispatch(endTrip());

      //TODO: Rewrite with saving points on the device
      if (isCoordinatesEqualZero(offer.points[0]) || isCoordinatesEqualZero(offer.points[1])) {
        store.dispatch(setIsOrderCanceledAlertVisible(true));
        return;
      }

      store.dispatch(createInitialOffer());
      store.dispatch(setOrderStatus(OrderStatus.Confirming));
      store.dispatch(setIsOrderCanceled(true));
      store.dispatch(setSelectedOrderId(null));
    }
  },

  //AfterPickUp when trip started and driver canceled trip - go to receipt screen
  [SSEAndNotificationsEventType.DriverRejected]: async () => {
    store.dispatch(setTripIsCanceled(true));
    const orderInfo = orderInfoSelector(store.getState());
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());

    if (orderInfo?.orderId === selectedOrderId && tripStatus !== TripStatus.Finished) {
      store.dispatch(getOrderInfo(orderInfo.orderId));
      store.dispatch(setTripStatus(TripStatus.Finished));
      store.dispatch(setSelectedOrderId(null));
    }
  },

  [SSEAndNotificationsEventType.TripStarted]: async () => {
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());
    const orderInfo = orderInfoSelector(store.getState());

    if (tripStatus !== TripStatus.Ride && orderInfo?.orderId === selectedOrderId) {
      store.dispatch(getCurrentOrder());
    }
  },

  [SSEAndNotificationsEventType.Custom]: async () => {
    //just custom notif for test from endpoint
  },

  [SSEAndNotificationsEventType.PaymentTracsactionStatus]: async () => {
    //add logic when payment will be done
  },
};

export const displayNotificationForAll = async (remoteMessage: NotificationRemoteMessage) => {
  const { key, payload } = remoteMessage.data;
  const { title, body } = remoteMessage.notification;

  console.log('displayNotificationForAll', remoteMessage);

  if (!isValidNotificationType(key)) {
    logger.error(`Invalid notification type: ${key}`);
    return;
  }

  try {
    let payloadData: NotificationPayload | undefined;

    if (payload) {
      try {
        payloadData = JSON.parse(payload);
      } catch (parseError) {
        logger.error(`Error parsing payload of notification ${remoteMessage}:`);
      }
    }

    await notificationHandlers[key](payloadData);

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'general',
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
    logger.error('Error processing notification:', error);
  }
};
