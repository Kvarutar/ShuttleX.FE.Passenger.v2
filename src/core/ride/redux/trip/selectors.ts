import { type AppState } from '../../../redux/store';

export const ContractorInfoSelector = (state: AppState) => state.trip.tripInfo?.contractor;
export const TripStatusSelector = (state: AppState) => state.trip.status;
export const TripInfoSelector = (state: AppState) => state.trip.tripInfo;
