import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { TripOrder, TripState, TripStatus } from './types';

const initialState: TripState = {
  order: null,
  status: TripStatus.Idle,
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setOrder(state, action: PayloadAction<TripOrder>) {
      state.order = action.payload;
    },
    setTripStatus(state, action: PayloadAction<TripStatus>) {
      state.status = action.payload;
    },
    endTrip(state) {
      state.order = initialState.order;
      state.status = initialState.status;
    },
  },
});

export const { setOrder, setTripStatus, endTrip } = slice.actions;

export default slice.reducer;
