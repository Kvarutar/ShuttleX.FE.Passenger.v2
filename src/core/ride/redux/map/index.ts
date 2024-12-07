import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MapState } from './types';

const initialState: MapState = {
  cameraMode: 'free',
  cars: [],
  polylines: [],
  stopPoints: [],
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
  },
});

export const { setMapCameraMode, setMapCars } = slice.actions;

export default slice.reducer;
