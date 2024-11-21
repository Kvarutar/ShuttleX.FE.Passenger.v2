import { LatLng } from 'react-native-maps';
import { NetworkErrorDetailsWithBody, Nullable, TariffType } from 'shuttlex-integration';

import { AddressPoint } from '../order/types';

export type ContractorInfoApiResponse = {
  firstName: string;
  arrivalTime: string;
  carBrand: string;
  carModel: string;
  carNumber: string;
  totalLikesCount: number;
  totalRidesCount: number;
  level: number;
  avatarId: string[];
  currencyCode: string;
  phoneNumber: string;
};

export type Contractor = {
  info: Nullable<ContractorInfoApiResponse>;
  avatar: string;
  orderId: string;
};

export type RouteInfoApiResponse = {
  routeId: string;
  totalDistanceMtr: number;
  totalDurationSec: number;
  waypoints: {
    geo: LatLng;
    index: number;
  }[];
  accurateGeometries: {
    polylineStartIndex: number;
    polylineEndIndex: number;
    trafficLoad: string;
  }[];
  geometry: string;
  trafficLoad: string;
  orderId: string;
};

export type RoutePickUpApiResponse = RouteInfoApiResponse;
export type RouteDropOffApiResponse = RouteInfoApiResponse;

export type RouteInfo = {
  pickUp: RoutePickUpApiResponse;
  dropOff: RouteDropOffApiResponse;
};

export type FeedbackAPIRequest = {
  isLikedByPassenger: boolean;
  positiveFeedbacks: string[];
  negativeFeedbacks: string[];
};

//TODO do something with this type
type RouteInfoOld = {
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

//TODO do something with this type
export type TripInfo = {
  //TODO ask Andrew
  tripType: TariffType;
  total: string;
  route: {
    startPoint: AddressPoint;
    endPoints: AddressPoint[];
    info: RouteInfoOld; // TODO: temporary, probably not the best place for this
  };
};

export enum TripStatus {
  Idle = 'idle',
  Accepted = 'accepted',
  Arrived = 'arrived',
  Ride = 'ride',
}

export type TripState = {
  contractor: Nullable<Contractor>;
  routeInfo: Nullable<RouteInfo>;
  status: TripStatus;
  tip: Nullable<number>;
  finishedTrips: number;
  isLoading: boolean;
  error: Nullable<NetworkErrorDetailsWithBody<any>>;
};
