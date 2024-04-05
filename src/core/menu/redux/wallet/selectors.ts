import { AppState } from '../../../redux/store';

export const selectedPaymentMethodSelector = (state: AppState) => state.wallet.payment.selectedMethod;
export const avaliablePaymentMethodsSelector = (state: AppState) => state.wallet.payment.avaliableMethods;
