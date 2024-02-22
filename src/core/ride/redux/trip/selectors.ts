import { type AppState } from '../../../redux/store';

export const ContractorInfoSelector = (state: AppState) => state.trip.contractor;
export const TripStatusSelector = (state: AppState) => state.trip.status;
