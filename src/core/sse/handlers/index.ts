import { EventSourceEvent } from 'react-native-sse';

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
import { SSEAndNotificationsEventType } from '../../utils/notifications/types';
import {
  SSEDriverAcceptedEventData,
  SSEDriverArrivedEventData,
  SSEDriverCanceledEventData,
  SSEDriverRejectedEventData,
  SSENewMessageEventData,
  SSETripEndedEventData,
  SSETripStartedEventData,
} from './types';

export const driverAcceptedSSEHandler = (
  event: EventSourceEvent<SSEAndNotificationsEventType.DriverAccepted, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    const tripStatus = tripStatusSelector(store.getState());
    const data: SSEDriverAcceptedEventData = JSON.parse(event.data);

    //Check trip status because notifications can get information earlier
    if (tripStatus !== TripStatus.Accepted) {
      store.dispatch(getOrderInfo(data.orderId));
      store.dispatch(getRouteInfo(data.orderId));
      store.dispatch(setTripStatus(TripStatus.Accepted));
      store.dispatch(setIsOrderCanceled(false));
      store.dispatch(setSelectedOrderId(data.orderId));
    }
  }
};

export const driverArrivedSSEHandler = (
  event: EventSourceEvent<SSEAndNotificationsEventType.DriverArrived, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());
    const data: SSEDriverArrivedEventData = JSON.parse(event.data);

    if (data.orderId === selectedOrderId && tripStatus !== TripStatus.Arrived) {
      store.dispatch(getCurrentOrder());
    }
  }
};

// Add such event callback type if you need payload(orderId):
// event: EventSourceEvent<SSEAndNotificationsEventType.DriverArrivedToStopPoint, SSEAndNotificationsEventType>,
//And data type if you need payload(orderId): SSEDriverArrivedToStopPointEventData
//If you don't need this payload - remove type
export const driverArrivedToStopPointSSEHandler = () => {
  //TODO: Add some logic in task with stop-points
};

// Add such event callback type if you need payload(orderId):
// event: EventSourceEvent<SSEAndNotificationsEventType.PickUpOnStopPoint, SSEAndNotificationsEventType>,
//And data type if you need payload(orderId): SSEPickUpStopPointEventData
//If you don't need this payload - remove type
export const pickUpOnStopPointSSEHandler = () => {
  //TODO: Add some logic in task with stop-points
};

export const newMessageSSEHandler = (
  event: EventSourceEvent<SSEAndNotificationsEventType.NewMessage, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    const newMessage = newMessageFromBackSelector(store.getState());
    const data: SSENewMessageEventData = JSON.parse(event.data);

    if (newMessage === null && data.messageId && data.chatId) {
      store.dispatch(
        setNewMessageFromBack({
          chatId: data.chatId,
          messageId: data.messageId,
        }),
      );
    }
  }
};

export const tripStartedSSEHandler = (
  event: EventSourceEvent<SSEAndNotificationsEventType.TripStarted, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    const tripStatus = tripStatusSelector(store.getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());
    const data: SSETripStartedEventData = JSON.parse(event.data);

    if (data.orderId === selectedOrderId && tripStatus !== TripStatus.Ride) {
      store.dispatch(getCurrentOrder());
    }
  }
};

export const tripEndedSSEHandler = (
  event: EventSourceEvent<SSEAndNotificationsEventType.TripEnded, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    const { getState, dispatch } = store;
    const tripStatus = tripStatusSelector(getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());
    const data: SSETripEndedEventData = JSON.parse(event.data);

    if (data.orderId === selectedOrderId && tripStatus !== TripStatus.Finished) {
      dispatch(addFinishedTrips());
      //TODO go to rating page
      dispatch(getTicketAfterRide());
      dispatch(setTripStatus(TripStatus.Finished));
      dispatch(getRecentDropoffs({ amount: 10 }));
    }
  }
};

export const driverCanceledSSEHandler = (
  event: EventSourceEvent<SSEAndNotificationsEventType.DriverCanceled, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    const { getState, dispatch } = store;
    const isOrderCanceled = isOrderCanceledSelector(getState());
    const orderInfo = orderInfoSelector(getState());
    const tripPickUpRouteFirstWaypoint = tripPickUpRouteFirstWaypointSelector(getState());
    const tripDropOffRouteLastWaypoint = tripDropOffRouteLastWaypointSelector(getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());
    const data: SSEDriverCanceledEventData = JSON.parse(event.data);

    //Because it can be changed in notifications or initial setup
    if (data.orderId === selectedOrderId && !isOrderCanceled) {
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
  }
};

export const driverRejectedSSEHandler = (
  event: EventSourceEvent<SSEAndNotificationsEventType.DriverRejected, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    store.dispatch(setTripIsCanceled(true));
    const { getState, dispatch } = store;
    const tripStatus = tripStatusSelector(getState());
    const selectedOrderId = selectedOrderIdSelector(getState());
    const data: SSEDriverRejectedEventData = JSON.parse(event.data);

    if (data.orderId === selectedOrderId && tripStatus !== TripStatus.Finished) {
      dispatch(getOrderInfo(data.orderId));
      dispatch(setTripStatus(TripStatus.Finished));
      dispatch(setSelectedOrderId(null));
    }
  }
};
