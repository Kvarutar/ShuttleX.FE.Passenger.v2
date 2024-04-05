import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TariffType } from 'shuttlex-integration';

import { fetchTripInfo } from '../trip/thunks';
import { createOrder, fetchAddresses } from './thunks';
import { AddressPoint, OrderState, OrderStatus } from './types';

const initialState: OrderState = {
  status: OrderStatus.StartRide,
  tripTariff: null,
  points: [
    { id: 0, address: '', longitude: 0, latitude: 0 },
    { id: 1, address: '', longitude: 0, latitude: 0 },
  ],
  isLoading: false,
};

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderStatus(state, action: PayloadAction<OrderStatus>) {
      state.status = action.payload;
    },
    setTripTariff(state, action: PayloadAction<TariffType>) {
      state.tripTariff = action.payload;
    },
    addOrderPoint(state, action: PayloadAction<AddressPoint>) {
      state.points.push(action.payload);
    },
    removeOrderPoint(state, action: PayloadAction<number>) {
      state.points = state.points.filter(point => point.id !== action.payload);
    },
    updateOrderPoint(state, action: PayloadAction<AddressPoint>) {
      const pointIndex = state.points.findIndex(point => point.id === action.payload.id);

      state.points[pointIndex] = action.payload;
    },
    cleanOrderPoints(state) {
      state.points = initialState.points;
    },
    cleanOrder(state) {
      state.points = initialState.points;
      state.status = initialState.status;
      state.tripTariff = initialState.tripTariff;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createOrder.rejected, state => {
        state.status = OrderStatus.RideUnavaliable;
      })
      .addCase(fetchAddresses.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchAddresses.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(fetchAddresses.rejected, state => {
        state.isLoading = false;
      })
      .addCase(fetchTripInfo.fulfilled, state => {
        slice.caseReducers.cleanOrder(state);
      })
      .addCase(fetchTripInfo.rejected, (state, action) => {
        if (action.payload === 'noDrivers') {
          state.status = OrderStatus.NoDrivers;
        } else {
          state.status = OrderStatus.RideUnavaliable;
        }
      });
  },
});

export const {
  setOrderStatus,
  setTripTariff,
  addOrderPoint,
  removeOrderPoint,
  updateOrderPoint,
  cleanOrderPoints,
  cleanOrder,
} = slice.actions;

export default slice.reducer;
