import { LatLng } from 'react-native-maps';
import { MapCameraMode, MapViewProps } from 'shuttlex-integration';

export type MapState = {
  cameraMode: MapCameraMode;
  polylines: Exclude<MapViewProps['polylines'], undefined>;
  stopPoints: LatLng[];
};
