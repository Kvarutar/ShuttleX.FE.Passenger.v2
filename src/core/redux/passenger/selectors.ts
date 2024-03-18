import { AppState } from '../store';

export const selectedPaymentMethodSelector = (state: AppState) => state.passenger.payment.selectedMethod;
export const avaliablePaymentMethodsSelector = (state: AppState) => state.passenger.payment.avaliableMethods;
