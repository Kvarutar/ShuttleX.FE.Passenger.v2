import { LatLng } from 'react-native-maps';
import { MapCameraMode } from 'shuttlex-integration';

export type MapState = {
  cameraMode: MapCameraMode;
  polylines: LatLng[];
  stopPoints: LatLng[];
};
