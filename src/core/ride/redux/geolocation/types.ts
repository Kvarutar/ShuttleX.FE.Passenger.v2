import Geolocation from 'react-native-geolocation-service';
import { LocationAccuracy } from 'react-native-permissions';

export type GeolocationState = {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isPermissionGranted: boolean;
  isLocationEnabled: boolean;
  accuracyOnlyIOS: LocationAccuracy | null;
  error?: {
    code: Geolocation.PositionError;
    message: string;
  };
};
