import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TariffType } from 'shuttlex-integration';

import { fetchTripInfo } from '../trip/thunks';
import { createOffer } from './thunks';
import { OrderState, OrderStatus, Point } from './types';

const initialState: OrderState = {
  status: OrderStatus.StartRide,
  tripTariff: null,
  points: [
    { id: 0, address: '' },
    { id: 1, address: '' },
  ],
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
    addOrderPoint(state, action: PayloadAction<Point>) {
      state.points.push(action.payload);
    },
    removeOrderPoint(state, action: PayloadAction<number>) {
      state.points = state.points.filter(point => point.id !== action.payload);
    },
    updateOrderPoint(state, action: PayloadAction<Point>) {
      const pointIndex = state.points.findIndex(point => point.id === action.payload.id);

      state.points[pointIndex] = action.payload;
    },
    clearOrderPoints(state) {
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
      .addCase(createOffer.rejected, state => {
        state.status = OrderStatus.RideUnavaliable;
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
  clearOrderPoints,
  cleanOrder,
} = slice.actions;

export default slice.reducer;
