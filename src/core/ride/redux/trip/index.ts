import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { cancelTrip, fetchTripInfo, sendFeedback } from './thunks';
import { TripInfo, TripState, TripStatus } from './types';

const initialState: TripState = {
  tripInfo: null,
  status: TripStatus.Idle,
  tip: null,
  finishedTrips: 0,
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
    setTip(state, action: PayloadAction<number | null>) {
      if (state.tripInfo) {
        state.tip = action.payload;
      }
    },
    endTrip(state) {
      state.tripInfo = null;
      state.status = initialState.status;
    },
    //TODO call it when notifications page will be done (call dispatch in tripEnded notification)
    addFinishedTrips(state) {
      state.finishedTrips++;
    },
    //TODO use it when lottery is done
    resetFinishedTrips(state) {
      state.finishedTrips = initialState.finishedTrips;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTripInfo.fulfilled, (state, action) => {
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
            tripType: action.payload.tripType,
            total: action.payload.total,
            route: {
              startPoint: action.payload.route.startPoint,
              endPoints: action.payload.route.endPoints,
              info: action.payload.route.info,
            },
          },
          type: setTripInfo.type,
        });
      })
      .addCase(sendFeedback.fulfilled, (state, action) => {
        slice.caseReducers.setTip(state, { payload: action.payload.tip ?? null, type: setTip.type });
      })
      .addCase(cancelTrip.fulfilled, state => {
        slice.caseReducers.endTrip(state);
      });
  },
});

export const { setTripInfo, setTripStatus, setTip, endTrip } = slice.actions;

export default slice.reducer;
