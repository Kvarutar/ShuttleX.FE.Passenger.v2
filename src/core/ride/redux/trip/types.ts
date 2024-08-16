import { LatLng } from 'react-native-maps';
import { TariffType } from 'shuttlex-integration';

import { AddressPoint } from '../order/types';

export type ContractorInfo = {
  name: string;
  car: {
    model: string;
    plateNumber: string;
  };
  phone: string;
  approximateArrival: number;
};

export enum TripStatus {
  Idle = 'idle',
  Arrived = 'arrived',
  Ride = 'ride',
}

type RouteInfo = {
  duration: number;
  distance: number;
  legs: {
    steps: {
      maneuver: {
        type: string;
        instruction: string;
        location: LatLng;
      };
      geometry: string;
    }[];
  }[];
};

export type TripInfo = {
  contractor: ContractorInfo;
  tripType: TariffType;
  total: string;
  route: {
    startPoint: AddressPoint;
    endPoints: AddressPoint[];
    info: RouteInfo; // TODO: temporary, probably not the best place for this
  };
};

export type TripState = {
  tripInfo: TripInfo | null;
  status: TripStatus;
  tip: number | null;
};
