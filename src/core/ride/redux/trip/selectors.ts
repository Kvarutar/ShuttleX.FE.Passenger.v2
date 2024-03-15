import { type AppState } from '../../../redux/store';

export const ContractorInfoSelector = (state: AppState) => state.trip.order?.contractor;
export const TripStatusSelector = (state: AppState) => state.trip.status;
export const TripOrderSelector = (state: AppState) => state.trip.order;
