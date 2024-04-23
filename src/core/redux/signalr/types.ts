import { LatLng } from 'react-native-maps';

export type SignalRState = {
  contractorCoordinates: LatLng | null;
  contractorsCars: LatLng[];
};
