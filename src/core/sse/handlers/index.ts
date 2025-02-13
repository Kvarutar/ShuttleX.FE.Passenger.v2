import { EventSourceEvent } from 'react-native-sse';
import { isCoordinatesEqualZero } from 'shuttlex-integration';

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
import { isOrderCanceledSelector, selectedOrderIdSelector, tripStatusSelector } from '../../ride/redux/trip/selectors';
import { getCurrentOrder, getOrderInfo, getRouteInfo } from '../../ride/redux/trip/thunks';
import { TripStatus } from '../../ride/redux/trip/types';
import { SSEAndNotificationsEventType } from '../../utils/notifications/types';
import {
  SSEDriverAcceptedEventData,
  SSEDriverArrivedEventData,
  SSEDriverCanceledEventData,
  SSEDriverRejectedEventData,
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
    const offer = offerSelector(getState());
    const selectedOrderId = selectedOrderIdSelector(store.getState());
    const data: SSEDriverCanceledEventData = JSON.parse(event.data);

    //Because it can be changed in notifications or initial setup
    if (data.orderId === selectedOrderId && !isOrderCanceled) {
      dispatch(endTrip());

      //TODO: Rewrite with saving points on the device
      if (isCoordinatesEqualZero(offer.points[0]) || isCoordinatesEqualZero(offer.points[1])) {
        dispatch(setIsOrderCanceledAlertVisible(true));
        return;
      }

      dispatch(createInitialOffer());
      dispatch(setOrderStatus(OrderStatus.Confirming));
      dispatch(setIsOrderCanceled(true));
      store.dispatch(setSelectedOrderId(null));
    }
  }
};

export const driverRejectedSSEHandler = (
  event: EventSourceEvent<SSEAndNotificationsEventType.DriverRejected, SSEAndNotificationsEventType>,
) => {
  if (event.data) {
    const { getState, dispatch } = store;
    const tripStatus = tripStatusSelector(getState());
    const selectedOrderId = selectedOrderIdSelector(getState());
    const data: SSEDriverRejectedEventData = JSON.parse(event.data);

    if (data.orderId === selectedOrderId && tripStatus !== TripStatus.Finished) {
      dispatch(setTripIsCanceled(true));
      dispatch(setTripStatus(TripStatus.Finished));
      dispatch(setIsOrderCanceled(true));
    }
  }
};
