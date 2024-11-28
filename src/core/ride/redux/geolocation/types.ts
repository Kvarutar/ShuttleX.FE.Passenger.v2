import Geolocation from 'react-native-geolocation-service';
import { LatLng } from 'react-native-maps';
import { LocationAccuracy } from 'react-native-permissions';
import { Nullable } from 'shuttlex-integration';

export type GeolocationState = {
  coordinates: LatLng | null;
  isPermissionGranted: boolean;
  isLocationEnabled: boolean;
  accuracy: LocationAccuracy;
  calculatedHeading: {
    headingExtended: number;
    current: number;
    previous: number;
    delta: number;
  };
  error?: Geolocation.GeoError;
};

export type ConvertGeoToAddressPayload = LatLng;

export type ConvertGeoToAddressAPIResponse = {
  fullAddress: string;
  place: string;
  geo: LatLng;
  country: Nullable<string>;
  countryCode: Nullable<string>;
  region: Nullable<string>;
  cityOrLocality: Nullable<string>;
};
