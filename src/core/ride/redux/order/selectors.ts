import { type AppState } from '../../../redux/store';

export const orderStatusSelector = (state: AppState) => state.order.status;
export const isOrderAddressSelectVisibleSelector = (state: AppState) => state.order.ui.isAddressSelectVisible;

//Loadings
export const isOrderLoadingSelector = (state: AppState) => state.order.isLoading;
