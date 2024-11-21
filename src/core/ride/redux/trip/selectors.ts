import { type AppState } from '../../../redux/store';

export const contractorInfoSelector = (state: AppState) => state.trip.contractor;
export const tripStatusSelector = (state: AppState) => state.trip.status;
export const routePickUpCoordinatesSelector = (state: AppState) => state.trip.routeInfo?.pickUp.waypoints[0].geo;
export const routeDropOffCoordinatesSelector = (state: AppState) => state.trip.routeInfo?.dropOff.waypoints[0].geo;
export const tripTipSelector = (state: AppState) => state.trip.tip;
export const finishedTripsSelector = (state: AppState) => state.trip.finishedTrips;
export const isTripLoadingSelector = (state: AppState) => state.trip.isLoading;
export const orderIdSelector = (state: AppState) => state.trip.contractor?.orderId;
