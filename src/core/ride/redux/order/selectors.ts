import { type AppState } from '../../../redux/store';

export const orderStatusSelector = (state: AppState) => state.order.status;
export const orderPointsSelector = (state: AppState) => state.order.points;
export const orderTariffSelector = (state: AppState) => state.order.tripTariff;
export const isOrderLoadingSelector = (state: AppState) => state.order.isLoading;
