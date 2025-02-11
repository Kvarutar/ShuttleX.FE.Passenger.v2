import { LatLng } from 'react-native-maps';
import { MapCameraMode, MapViewProps } from 'shuttlex-integration';

import { RouteInfoApiResponse } from '../trip/types';

export type MapState = {
  cameraMode: MapCameraMode;
  cars: {
    id: string;
    coordinates: LatLng;
    heading: number;
  }[];
  polylines: Exclude<MapViewProps['polylines'], undefined>;
  stopPoints: LatLng[];
  ridePercentFromPolylines: string;
  routeTraffic: RouteInfoApiResponse['legs'][0]['accurateGeometries'] | null;
};
