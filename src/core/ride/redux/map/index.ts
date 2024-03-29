import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MapState } from './types';

const initialState: MapState = {
  cameraMode: 'free',
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
    setMapPolylines(state, action: PayloadAction<MapState['polylines']>) {
      state.polylines = action.payload;
    },
    setMapStopPoints(state, action: PayloadAction<MapState['stopPoints']>) {
      state.stopPoints = action.payload;
    },
  },
});

export const { setMapCameraMode, setMapPolylines, setMapStopPoints } = slice.actions;

export default slice.reducer;
