import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { OrderState, OrderStatus } from './types';

const initialState: OrderState = {
  status: OrderStatus.StartRide,
  isLoading: false,
  ui: {
    isAddressSelectVisible: false,
  },
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
    setIsAddressSelectVisible(state, action: PayloadAction<boolean>) {
      state.ui.isAddressSelectVisible = action.payload;
    },
  },
});

export const { setOrderStatus, cleanOrder, setIsAddressSelectVisible } = slice.actions;

export default slice.reducer;
