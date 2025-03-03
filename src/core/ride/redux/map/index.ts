import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getInterestingPlaces } from './thunks';
import { MapState } from './types';

const initialState: MapState = {
  cameraMode: 'free',
  cars: [],
  interestingPlaces: [],
  polylines: [],
  stopPoints: [],
  ridePercentFromPolylines: '0%',
  routeTraffic: null,
};

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapCameraMode(state, action: PayloadAction<MapState['cameraMode']>) {
      state.cameraMode = action.payload;
    },
    setMapCars(state, action: PayloadAction<MapState['cars']>) {
      state.cars = action.payload;
    },
    setInterestingPlaces(state, action: PayloadAction<MapState['interestingPlaces']>) {
      state.interestingPlaces = action.payload;
    },
    setMapRidePercentFromPolylines(state, action: PayloadAction<MapState['ridePercentFromPolylines']>) {
      state.ridePercentFromPolylines = action.payload;
    },
    setMapRouteTraffic(state, action: PayloadAction<MapState['routeTraffic']>) {
      state.routeTraffic = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getInterestingPlaces.fulfilled, (state, action) => {
      if (action.payload) {
        state.interestingPlaces = action.payload;
      }
    });
  },
});

export const {
  setMapCameraMode,
  setMapCars,
  setInterestingPlaces,
  setMapRidePercentFromPolylines,
  setMapRouteTraffic,
} = slice.actions;

export default slice.reducer;
