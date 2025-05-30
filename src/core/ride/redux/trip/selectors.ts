import { createSelector } from '@reduxjs/toolkit';

import { type AppState } from '../../../redux/store';

export const selectedOrderIdSelector = (state: AppState) => state.trip.selectedOrderId;
export const orderSelector = (state: AppState) => state.trip.order;
export const tripStatusSelector = (state: AppState) => state.trip.status;
export const tripPickUpRouteSelector = (state: AppState) => state.trip.routeInfo?.pickUp;
export const tripDropOffRouteSelector = (state: AppState) => state.trip.routeInfo?.dropOff;
export const tripTipSelector = (state: AppState) => state.trip.tip;
export const finishedTripsSelector = (state: AppState) => state.trip.finishedTrips;
export const orderIdSelector = (state: AppState) => state.trip.order?.orderId;
export const isOrderCanceledSelector = (state: AppState) => state.trip.isOrderCanceled;
export const orderInfoSelector = (state: AppState) => state.trip.order?.info;
export const orderTariffIdSelector = (state: AppState) => state.trip.order?.info?.tariffId;
export const orderTariffInfoSelector = (state: AppState) => state.trip.order?.tariffInfo;
export const contractorAvatarSelector = (state: AppState) => state.trip.order?.avatar;
export const isTripCanceledSelector = (state: AppState) => state.trip.isCanceled;
export const tripReceiptSelector = (state: AppState) => state.trip.receipt;

//Loadings
export const isTripCanceledLoadingSelector = (state: AppState) => state.trip.loading.cancelTrip;
export const isRouteInfoLoadingSelector = (state: AppState) => state.trip.loading.routeInfo;
export const isTripLoadingSelector = (state: AppState) => state.trip.loading.orderInfo;
export const isOrderLongPollingLoadingSelector = (state: AppState) => state.trip.loading.orderLongpolling;
export const isTripSuccessLongPollingLoadingSelector = (state: AppState) =>
  state.trip.loading.tripSuccessfullLongPolling;
export const isTripCanceledBeforePickUpLoadingSelector = (state: AppState) => state.trip.loading.orderLongpolling;
export const isCancelOfferLoadingSelector = (state: AppState) => state.trip.loading.cancelOffer;

//Errors
export const orderInfoErrorSelector = (state: AppState) => state.trip.error.orderInfo;

//UI
export const isOrderCanceledAlertVisibleSelector = (state: AppState) => state.trip.ui.isOrderCanceledAlertVisible;

export const tripPickUpRouteFirstWaypointSelector = createSelector(
  [tripPickUpRouteSelector],
  route => route?.waypoints[0],
);
export const tripPickUpRouteLastWaypointSelector = createSelector(
  [tripPickUpRouteSelector],
  route => route?.waypoints[route.waypoints.length - 1],
);
export const tripDropOffRouteFirstWaypointSelector = createSelector(
  [tripDropOffRouteSelector],
  route => route?.waypoints[0],
);
export const tripDropOffRouteLastWaypointSelector = createSelector(
  [tripDropOffRouteSelector],
  route => route?.waypoints[route.waypoints.length - 1],
);
