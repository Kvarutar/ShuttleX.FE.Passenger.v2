import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { fetchTripInfo } from './thunks';
import { TripInfo, TripState, TripStatus } from './types';

const initialState: TripState = {
  tripInfo: null,
  status: TripStatus.Idle,
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTripInfo(state, action: PayloadAction<TripInfo>) {
      state.tripInfo = action.payload;
    },
    setTripStatus(state, action: PayloadAction<TripStatus>) {
      state.status = action.payload;
    },
    endTrip(state) {
      state.tripInfo = null;
      state.status = initialState.status;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTripInfo.fulfilled, (state, action) => {
      slice.caseReducers.setTripInfo(state, {
        payload: {
          contractor: {
            name: action.payload.contractor.name,
            car: {
              model: action.payload.contractor.car.model,
              plateNumber: action.payload.contractor.car.plateNumber,
            },
            phone: action.payload.contractor.phone,
            approximateArrival: new Date().getTime() + 180000, //for test
          },
          tripType: 'BasicX',
          total: action.payload.total,
        },
        type: setTripInfo.type,
      });
    });
  },
});

export const { setTripInfo, setTripStatus, endTrip } = slice.actions;

export default slice.reducer;
