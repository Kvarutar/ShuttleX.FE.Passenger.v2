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
  setTripIsCanceled,
  setTripStatus,
} from '../../ride/redux/trip';
import { isOrderCanceledSelector, tripStatusSelector } from '../../ride/redux/trip/selectors';
import { getCurrentOrder, getOrderInfo, getRouteInfo } from '../../ride/redux/trip/thunks';
import { TripStatus } from '../../ride/redux/trip/types';
import { SSEAndNotificationsEventType } from '../../utils/notifications/types';
import { SSEDriverAcceptedEventData } from './types';

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
    }
  }
};

export const driverArrivedSSEHandler = () => {
  const tripStatus = tripStatusSelector(store.getState());

  if (tripStatus !== TripStatus.Arrived) {
    store.dispatch(getCurrentOrder());
  }
};

export const tripStartedSSEHandler = () => {
  const tripStatus = tripStatusSelector(store.getState());

  if (tripStatus !== TripStatus.Ride) {
    store.dispatch(getCurrentOrder());
  }
};

export const tripEndedSSEHandler = () => {
  const { getState, dispatch } = store;
  const tripStatus = tripStatusSelector(getState());

  if (tripStatus !== TripStatus.Finished) {
    dispatch(addFinishedTrips());
    //TODO go to rating page
    dispatch(getTicketAfterRide());
    dispatch(setTripStatus(TripStatus.Finished));
    dispatch(getRecentDropoffs({ amount: 10 }));
  }
};

export const driverCanceledSSEHandler = () => {
  const { getState, dispatch } = store;
  const isOrderCanceled = isOrderCanceledSelector(getState());
  const offer = offerSelector(getState());

  //Because it can be changed in notifications or initial setup
  if (!isOrderCanceled) {
    dispatch(endTrip());

    //TODO: Rewrite with saving points on the device
    if (isCoordinatesEqualZero(offer.points[0]) || isCoordinatesEqualZero(offer.points[1])) {
      dispatch(setIsOrderCanceledAlertVisible(true));
      return;
    }

    dispatch(createInitialOffer());
    dispatch(setOrderStatus(OrderStatus.Confirming));
    dispatch(setIsOrderCanceled(true));
  }
};

export const driverRejectedSSEHandler = () => {
  const { getState, dispatch } = store;
  const tripStatus = tripStatusSelector(getState());

  if (tripStatus !== TripStatus.Finished) {
    dispatch(setTripIsCanceled(true));
    dispatch(setTripStatus(TripStatus.Finished));
  }
};
