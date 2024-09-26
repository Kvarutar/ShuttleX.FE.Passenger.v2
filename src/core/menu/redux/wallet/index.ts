import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentMethod } from 'shuttlex-integration';

import { WalletState } from './types';

const cashPaymentMethod = {
  details: 'Cash',
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
      state.payment.avaliableMethods.push(action.payload);
    },
    deleteAvaliablePaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.payment.avaliableMethods = state.payment.avaliableMethods.filter(
        details => details.details !== action.payload.details,
        //TODO change 'details' for something more reliable
      );
    },
  },
});

export const {
  setSelectedPaymentMethod,
  setAvaliablePaymentMethods,
  addAvaliablePaymentMethod,
  deleteAvaliablePaymentMethod,
} = slice.actions;

export default slice.reducer;
