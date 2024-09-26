import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentMethod } from 'shuttlex-integration';

import { WalletState } from './types';

const cashPaymentMethod = {
  details: '',
  method: 'cash',
  expiresAt: '',
};

const initialState: WalletState = {
  payment: {
    selectedMethod: null,
    avaliableMethods: [cashPaymentMethod],
  },
};

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setSelectedPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.payment.selectedMethod = action.payload;
    },
    setAvaliablePaymentMethods(state, action: PayloadAction<PaymentMethod[]>) {
      state.payment.avaliableMethods = [...action.payload, cashPaymentMethod];
    },
    addAvaliablePaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.payment.avaliableMethods.unshift(action.payload);
    },
  },
});

export const { setSelectedPaymentMethod, setAvaliablePaymentMethods, addAvaliablePaymentMethod } = slice.actions;

export default slice.reducer;
