import { LatLng } from 'react-native-maps';
import { TariffType } from 'shuttlex-integration';

import { AddressPoint } from '../order/types';

export type ContractorInfo = {
  firstName: string;
  arrivalTime: string;
  carBrand: string;
  carModel: string;
  carNumber: string;
  totalLikesCount: number;
  //TODO add phone number when back will add it
  totalRidesCount: number;
  level: number;
  avatarId: string;
  currencyCode: string;
};

export enum TripStatus {
  Idle = 'idle',
  Accepted = 'accepted',
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
  tripType: TariffType;
  total: string;
  route: {
    startPoint: AddressPoint;
    endPoints: AddressPoint[];
    info: RouteInfo; // TODO: temporary, probably not the best place for this
  };
};

export type TripState = {
  contractorInfo: ContractorInfo | null;
  tripInfo: TripInfo | null;
  status: TripStatus;
  tip: number | null;
  finishedTrips: number;
};
