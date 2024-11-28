import { type AppState } from '../../../redux/store';

export const orderStatusSelector = (state: AppState) => state.order.status;
export const isOrderLoadingSelector = (state: AppState) => state.order.isLoading;
