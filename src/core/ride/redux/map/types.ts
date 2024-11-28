import { LatLng } from 'react-native-maps';
import { MapCameraMode, MapViewProps } from 'shuttlex-integration';

export type MapState = {
  cameraMode: MapCameraMode;
  cars: {
    id: string;
    coordinates: LatLng;
    heading: number;
  }[];
  polylines: Exclude<MapViewProps['polylines'], undefined>;
  stopPoints: LatLng[];
};
