import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PassengerState, PaymentMethodType } from './types';

const initialState: PassengerState = {
  payment: {
    selectedMethod: null,
    allMethods: null,
  },
};

const slice = createSlice({
  name: 'passenger',
  initialState,
  reducers: {
    setSelectedPaymentMethod(state, action: PayloadAction<PaymentMethodType>) {
      state.payment.selectedMethod = action.payload;
    },
  },
});

export const { setSelectedPaymentMethod } = slice.actions;

export default slice.reducer;
