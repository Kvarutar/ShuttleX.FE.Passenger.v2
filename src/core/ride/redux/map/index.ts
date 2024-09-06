import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import googlePolyline from 'google-polyline';
import { LatLng } from 'react-native-maps';

import { fetchTripInfo } from '../trip/thunks';
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
  extraReducers: builder => {
    // TODO: Just logic, not real implementation
    builder.addCase(fetchTripInfo.fulfilled, (state, action) => {
      const points: LatLng[] = [];
      for (const leg of action.payload.route.info.legs) {
        for (const step of leg.steps) {
          const decodedPoints = googlePolyline.decode(step.geometry);
          for (const point of decodedPoints) {
            points.push({ latitude: point[0], longitude: point[1] });
          }
        }
      }

      slice.caseReducers.setMapPolylines(state, {
        payload: [{ type: 'straight', options: { coordinates: points } }],
        type: setMapPolylines.type,
      });

      slice.caseReducers.setMapStopPoints(state, {
        payload: action.payload.route.endPoints,
        type: setMapStopPoints.type,
      });
    });
  },
});

export const { setMapCameraMode, setMapPolylines, setMapStopPoints } = slice.actions;

export default slice.reducer;
