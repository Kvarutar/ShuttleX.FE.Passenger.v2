import { LatLng } from 'react-native-maps';

export type UpdatePassengerGeoSignalRRequest = {
  position: LatLng;
  state: 'InRadius' | 'InOrder' | 'InThinking';
  orderId: string | null;
};

export type UpdatePassengerGeoSignalRResponse = {
  contractorId: string;
  location: LatLng;
  angle: number;
}[];
