import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { OrderState, OrderStatus } from './types';

const initialState: OrderState = {
  status: OrderStatus.StartRide,
  isLoading: false,
};

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderStatus(state, action: PayloadAction<OrderStatus>) {
      state.status = action.payload;
    },
    cleanOrder(state) {
      state.status = initialState.status;
      state.isLoading = initialState.isLoading;
    },
  },
});

export const { setOrderStatus, cleanOrder } = slice.actions;

export default slice.reducer;
