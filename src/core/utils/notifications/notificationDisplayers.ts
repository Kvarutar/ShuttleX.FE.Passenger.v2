import notifee, { AndroidColor } from '@notifee/react-native';

import { logger } from '../../../App';
import { setWinnerPrizes } from '../../lottery/redux';
import { getTicketAfterRide } from '../../lottery/redux/thunks';
import { store } from '../../redux/store';
import { setNewMessageFromBack } from '../../ride/redux/chat';
import { newMessageFromBackSelector } from '../../ride/redux/chat/selectors';
import { updateOfferPoint } from '../../ride/redux/offer';
import { getRecentDropoffs } from '../../ride/redux/offer/thunks';
import { setIsAddressSelectVisible, setOrderStatus } from '../../ride/redux/order';
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
  tripDropOffRouteLastWaypointSelector,
  tripPickUpRouteFirstWaypointSelector,
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
  [SSEAndNotificationsEventType.TripEnded]: async payload => {
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());

    if (payload?.orderId === selectedOrderId && tripStatus !== TripStatus.Finished) {
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
  [SSEAndNotificationsEventType.DriverArrived]: async payload => {
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());

    if (tripStatus !== TripStatus.Arrived && payload?.orderId === selectedOrderId) {
      store.dispatch(getCurrentOrder());
    }
  },

  // BeforePickup when trip doesnt start and driver rejected - go to search driver again
  [SSEAndNotificationsEventType.DriverCanceled]: async payload => {
    const { getState, dispatch } = store;
    const isOrderCanceled = isOrderCanceledSelector(getState());
    const selectedOrderId = selectedOrderIdSelector(getState());
    const orderInfo = orderInfoSelector(getState());
    const tripPickUpRouteFirstWaypoint = tripPickUpRouteFirstWaypointSelector(getState());
    const tripDropOffRouteLastWaypoint = tripDropOffRouteLastWaypointSelector(getState());

    //Because it can be changed in sse
    if (payload?.orderId === selectedOrderId && !isOrderCanceled) {
      if (orderInfo && tripPickUpRouteFirstWaypoint && tripDropOffRouteLastWaypoint) {
        dispatch(
          updateOfferPoint({
            id: 0,
            address: orderInfo.pickUpPlace,
            fullAddress: orderInfo.pickUpFullAddress,
            latitude: tripPickUpRouteFirstWaypoint.geo.latitude,
            longitude: tripPickUpRouteFirstWaypoint.geo.longitude,
          }),
        );
        dispatch(
          updateOfferPoint({
            id: 1,
            address: orderInfo.dropOffPlace,
            fullAddress: orderInfo.dropOffFullAddress,
            latitude: tripDropOffRouteLastWaypoint.geo.latitude,
            longitude: tripDropOffRouteLastWaypoint.geo.longitude,
          }),
        );
      }

      dispatch(setIsAddressSelectVisible(true));
      dispatch(endTrip());
      dispatch(setIsOrderCanceled(true));
      dispatch(setSelectedOrderId(null));
      dispatch(setIsOrderCanceledAlertVisible(true));
      dispatch(setOrderStatus(OrderStatus.StartRide));
    }
  },

  //AfterPickUp when trip started and driver canceled trip - go to receipt screen
  [SSEAndNotificationsEventType.DriverRejected]: async payload => {
    store.dispatch(setTripIsCanceled(true));
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());

    if (payload?.orderId === selectedOrderId && tripStatus !== TripStatus.Finished) {
      store.dispatch(getOrderInfo(payload.orderId));
      store.dispatch(setTripStatus(TripStatus.Finished));
      store.dispatch(setSelectedOrderId(null));
    }
  },

  [SSEAndNotificationsEventType.TripStarted]: async payload => {
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());

    if (tripStatus !== TripStatus.Ride && payload?.orderId === selectedOrderId) {
      store.dispatch(getCurrentOrder());
    }
  },

  [SSEAndNotificationsEventType.Custom]: async () => {
    //just custom notif for test from endpoint
  },

  [SSEAndNotificationsEventType.PaymentTracsactionStatus]: async () => {
    //add logic when payment will be done
  },
  [SSEAndNotificationsEventType.DriverArrivedToStopPoint]: async () => {
    //add logic when stop points will be done
    //payload contains OrderId
  },
  [SSEAndNotificationsEventType.PickUpOnStopPoint]: async () => {
    //add logic when stop points will be done
    //payload contains OrderId
  },
  [SSEAndNotificationsEventType.NewMessage]: async payload => {
    const newMessage = newMessageFromBackSelector(store.getState());
    if (newMessage === null && payload?.messageId && payload.chatId) {
      store.dispatch(
        setNewMessageFromBack({
          chatId: payload.chatId,
          messageId: payload.messageId,
        }),
      );
    }
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
