import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MapState } from './types';

const initialState: MapState = {
  cameraMode: 'free',
  cars: [],
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
    setMapRidePercentFromPolylines(state, action: PayloadAction<MapState['ridePercentFromPolylines']>) {
      state.ridePercentFromPolylines = action.payload;
    },
    setMapRouteTraffic(state, action: PayloadAction<MapState['routeTraffic']>) {
      state.routeTraffic = action.payload;
    },
  },
});

export const { setMapCameraMode, setMapCars, setMapRidePercentFromPolylines, setMapRouteTraffic } = slice.actions;

export default slice.reducer;
