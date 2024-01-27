import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { GeolocationState } from './types';

const initialState: GeolocationState = {
  coordinates: { latitude: 0, longitude: 0 },
  isPermissionGranted: false,
  isLocationEnabled: false,
  accuracyOnlyIOS: null,
};

const slice = createSlice({
  name: 'geolocation',
  initialState,
  reducers: {
    setGeolocationCoordinates(state, action: PayloadAction<GeolocationState['coordinates']>) {
      state.coordinates = action.payload;
    },
    setGeolocationIsPermissionGranted(state, action: PayloadAction<GeolocationState['isPermissionGranted']>) {
      state.isPermissionGranted = action.payload;
    },
    setGeolocationIsLocationEnabled(state, action: PayloadAction<GeolocationState['isLocationEnabled']>) {
      state.isLocationEnabled = action.payload;
    },
    setGeolocationAccuracyOnlyIOS(state, action: PayloadAction<GeolocationState['accuracyOnlyIOS']>) {
      state.accuracyOnlyIOS = action.payload;
    },
    setGeolocationError(state, action: PayloadAction<GeolocationState['error']>) {
      state.error = action.payload;
    },
  },
});

export const {
  setGeolocationCoordinates,
  setGeolocationIsPermissionGranted,
  setGeolocationIsLocationEnabled,
  setGeolocationAccuracyOnlyIOS,
  setGeolocationError,
} = slice.actions;

export default slice.reducer;
