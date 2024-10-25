import { type AppState } from '../../../redux/store';

export const contractorInfoSelector = (state: AppState) => state.trip.contractorInfo;
export const tripStatusSelector = (state: AppState) => state.trip.status;
export const tripInfoSelector = (state: AppState) => state.trip.tripInfo;
export const tripTipSelector = (state: AppState) => state.trip.tip;
export const finishedTripsSelector = (state: AppState) => state.trip.finishedTrips;
