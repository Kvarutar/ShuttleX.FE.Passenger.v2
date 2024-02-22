import { type AppState } from '../../../redux/store';

export const OfferStatusSelector = (state: AppState) => state.offer.status;
