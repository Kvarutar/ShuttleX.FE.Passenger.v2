import { AppState } from '../../../redux/store';

export const geolocationCoordinatesSelector = (state: AppState) => state.geolocation.coordinates;
export const geolocationIsPermissionGrantedSelector = (state: AppState) => state.geolocation.isPermissionGranted;
export const geolocationIsLocationEnabledSelector = (state: AppState) => state.geolocation.isLocationEnabled;
export const geolocationAccuracyOnlyIOSSelector = (state: AppState) => state.geolocation.accuracyOnlyIOS;
export const geolocationErrorSelector = (state: AppState) => state.geolocation.error;
