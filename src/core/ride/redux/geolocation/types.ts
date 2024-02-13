import Geolocation from 'react-native-geolocation-service';
import { LocationAccuracy } from 'react-native-permissions';

export type GeolocationState = {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isPermissionGranted: boolean;
  isLocationEnabled: boolean;
  accuracy: LocationAccuracy;
  error?: Geolocation.GeoError;
};
