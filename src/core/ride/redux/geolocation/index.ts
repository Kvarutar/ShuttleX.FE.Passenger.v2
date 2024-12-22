import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from 'react-native-maps';
import { calculateExtendedHeading, getAngleBetweenPoints } from 'shuttlex-integration';

import { convertGeoToAddress } from './thunks';
import { GeolocationState } from './types';

export const geolocationSliceName = 'geolocation';

const initialState: GeolocationState = {
  coordinates: null,
  isPermissionGranted: true,
  isLocationEnabled: true,
  accuracy: 'full',
  isGeolocationLoaded: false,
  calculatedHeading: {
    headingExtended: 0,
    current: 0,
    previous: 0,
    delta: 0,
  },
};

const slice = createSlice({
  name: geolocationSliceName,
  initialState,
  reducers: {
    setGeolocationCoordinates(state, action: PayloadAction<LatLng & { heading: number }>) {
      if (state.coordinates) {
        const res = calculateExtendedHeading({
          current: getAngleBetweenPoints(state.coordinates, action.payload),
          previous: state.calculatedHeading.current,
          delta: state.calculatedHeading.delta,
        });
        if (res) {
          state.calculatedHeading = res;
        }
      }

      state.isGeolocationLoaded = true;
      state.coordinates = action.payload;
    },
    setGeolocationIsPermissionGranted(state, action: PayloadAction<GeolocationState['isPermissionGranted']>) {
      if (!action.payload) {
        state.isGeolocationLoaded = true;
      }
      state.isPermissionGranted = action.payload;
    },
    setGeolocationIsLocationEnabled(state, action: PayloadAction<GeolocationState['isLocationEnabled']>) {
      if (!action.payload) {
        state.isGeolocationLoaded = true;
      }
      state.isLocationEnabled = action.payload;
    },
    setGeolocationAccuracy(state, action: PayloadAction<GeolocationState['accuracy']>) {
      state.accuracy = action.payload;
    },
    setGeolocationError(state, action: PayloadAction<GeolocationState['error']>) {
      state.isGeolocationLoaded = true;
      state.error = action.payload;
    },
    setIsGeolocationLoaded(state, action: PayloadAction<boolean>) {
      state.isGeolocationLoaded = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(convertGeoToAddress.rejected, (_, action) => {
      console.error(convertGeoToAddress.typePrefix, action.payload);
    });
  },
});

export const {
  setGeolocationCoordinates,
  setGeolocationIsPermissionGranted,
  setGeolocationIsLocationEnabled,
  setGeolocationAccuracy,
  setGeolocationError,
  setIsGeolocationLoaded,
} = slice.actions;

export default slice.reducer;
