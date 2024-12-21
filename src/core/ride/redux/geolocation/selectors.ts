import { AppState } from '../../../redux/store';

export const geolocationCoordinatesSelector = (state: AppState) => state.geolocation.coordinates;
export const geolocationIsPermissionGrantedSelector = (state: AppState) => state.geolocation.isPermissionGranted;
export const geolocationIsLocationEnabledSelector = (state: AppState) => state.geolocation.isLocationEnabled;
export const geolocationAccuracySelector = (state: AppState) => state.geolocation.accuracy;
export const geolocationCalculatedHeadingSelector = (state: AppState) =>
  state.geolocation.calculatedHeading.headingExtended;
export const geolocationErrorSelector = (state: AppState) => state.geolocation.error;
export const isGeolocationCoordinatesLoadedSelector = (state: AppState) => state.geolocation.isGeolocationLoaded;
