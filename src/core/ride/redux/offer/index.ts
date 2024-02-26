import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TariffType } from 'shuttlex-integration';

import { OfferState, OfferStatus, Point } from './types';

const initialState: OfferState = {
  status: OfferStatus.StartRide,
  tripTariff: null,
  points: [
    { id: 0, address: '' },
    { id: 1, address: '' },
  ],
};

const slice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setOfferStatus(state, action: PayloadAction<OfferStatus>) {
      state.status = action.payload;
    },
    setTripTariff(state, action: PayloadAction<TariffType>) {
      state.tripTariff = action.payload;
    },
    addOfferPoint(state, action: PayloadAction<Point>) {
      state.points.push(action.payload);
    },
    removeOfferPoint(state, action: PayloadAction<number>) {
      state.points = state.points.filter(point => point.id !== action.payload);
    },
    updateOfferPoint(state, action: PayloadAction<Point>) {
      const pointIndex = state.points.findIndex(point => point.id === action.payload.id);

      state.points[pointIndex] = action.payload;
    },
    clearOfferPoints(state) {
      state.points = initialState.points;
    },
  },
});

export const { setOfferStatus, setTripTariff, addOfferPoint, removeOfferPoint, updateOfferPoint, clearOfferPoints } =
  slice.actions;

export default slice.reducer;
