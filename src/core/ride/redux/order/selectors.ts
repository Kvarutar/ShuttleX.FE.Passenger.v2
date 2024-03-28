import { type AppState } from '../../../redux/store';

export const OrderStatusSelector = (state: AppState) => state.order.status;
export const OrderPointsSelector = (state: AppState) => state.order.points;
export const OrderTariffSelector = (state: AppState) => state.order.tripTariff;
