import { AppState } from '../store';

export const selectedPaymentMethodSelector = (state: AppState) => state.passenger.payment.selectedMethod;
export const allPaymentMethodsSelector = (state: AppState) => state.passenger.payment.allMethods;
