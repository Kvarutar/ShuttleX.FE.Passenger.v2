import { LatLng } from 'react-native-maps';
import { Nullable } from 'shuttlex-integration';

export type UpdatePassengerGeoSignalRRequest = {
  position: Nullable<LatLng>;
  state: 'InRadius' | 'InThinking' | 'InOrder';
  orderId: Nullable<string>;
};

export type UpdatePassengerGeoSignalRResponse = {
  contractorId: string;
  location: LatLng;
  angle: number;
}[];
