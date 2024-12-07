import { LatLng } from 'react-native-maps';

export type UpdatePassengerGeoSignalRRequest = {
  position: LatLng;
  state: 'InOrder' | 'InThinking' | 'InLooking';
  orderId: string | null;
};

export type UpdatePassengerGeoSignalRResponse = {
  contractorId: string;
  location: LatLng;
  angle: number;
}[];
