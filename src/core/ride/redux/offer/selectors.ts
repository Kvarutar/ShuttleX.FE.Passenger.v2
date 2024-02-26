import { type AppState } from '../../../redux/store';

export const OfferStatusSelector = (state: AppState) => state.offer.status;
export const OfferPointsSelector = (state: AppState) => state.offer.points;
