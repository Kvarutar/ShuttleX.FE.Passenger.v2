import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentMethod } from 'shuttlex-integration';

import { PassengerState } from './types';

const initialState: PassengerState = {
  payment: {
    selectedMethod: null,
    avaliableMethods: [],
  },
};

const slice = createSlice({
  name: 'passenger',
  initialState,
  reducers: {
    setSelectedPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.payment.selectedMethod = action.payload;
    },
    setAvaliablePaymentMethods(state, action: PayloadAction<PaymentMethod[]>) {
      state.payment.avaliableMethods = action.payload;
    },
    addAvaliablePaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.payment.avaliableMethods.unshift(action.payload);
    },
  },
});

export const { setSelectedPaymentMethod, setAvaliablePaymentMethods, addAvaliablePaymentMethod } = slice.actions;

export default slice.reducer;
