import { LatLng } from 'react-native-maps';
import { NetworkErrorDetailsWithBody, Nullable, TariffType } from 'shuttlex-integration';

import { AddressPoint } from '../offer/types';

export type TripStatusFromAPI =
  | 'None'
  | 'InPreviousOrder'
  | 'MoveToPickUp'
  | 'InPickUp'
  | 'MoveToStopPoint'
  | 'InStopPoint'
  | 'MoveToDropOff'
  | 'CompletedSuccessfully'
  | 'CanceledByPassenger'
  | 'CanceledByContractor';

export type OrderFromAPI = {
  orderId: string;
  firstName: string;
  carBrand: string;
  carModel: string;
  carNumber: string;
  totalLikesCount: number;
  totalRidesCount: number;
  level: number;
  avatarIds: string[];
  currencyCode: string;
  phoneNumber: string;
  estimatedArriveToPickUpDate: string;
  estimatedArriveToDropOffDate: string;
  dropOffRouteId: string;
  pickUpRouteId: string;
  pickUpAddress: string;
  pickUpPlace: string;
  dropOffAddress: string;
  dropOffPlace: string;
  state: TripStatusFromAPI;
  totalFinalPrice: number;
  tariffId: string;
  passengerId: string;
  finishedDate: string;
  estimatedPrice: number;
  acceptedOfferZoneId: string;
};

export type GetCurrentOrderAPIResponse = OrderFromAPI;
export type GetOrderInfoAPIResponse = OrderFromAPI;
export type GetOrdersHistoryAPIResponse = OrderFromAPI[];

export type Order = {
  info: Nullable<OrderFromAPI>;
  avatar: Nullable<string>;
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

export type FeedbackRatingReasonsToAPI =
  | 'BadAtmosphere'
  | 'RudeDriver'
  | 'BadDriving'
  | 'DirtyCar'
  | 'NiceAtmosphere'
  | 'FriendlyDriver'
  | 'GoodDriving'
  | 'CleanCar';

export type FeedbackAPIRequest = {
  isLikedByPassenger: Nullable<boolean>;
  positiveFeedbacks: FeedbackRatingReasonsToAPI[];
  negativeFeedbacks: FeedbackRatingReasonsToAPI[];
};

export type LongPollingAPIResponse = {
  orderId: string;
};

export type LongPollingInSomePointAPIResponse = {
  orderId: string;
  date: string;
};

export type OrderLongPollingAPIResponse = LongPollingAPIResponse;
export type TripSuccessfullLongPollingAPIResponse = LongPollingAPIResponse;
export type TripCanceledBeforePickupLongPollingAPIResponse = LongPollingAPIResponse;
export type TripCanceledAfterPickupLongPollingAPIResponse = LongPollingAPIResponse;
export type TripInPickupLongPollingAPIResponse = LongPollingInSomePointAPIResponse;
export type TripInStopPointAPIResponse = LongPollingInSomePointAPIResponse;
export type TripInDropOffAPIResponse = LongPollingInSomePointAPIResponse;

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
  Finished = 'finished',
}

export type TripState = {
  order: Nullable<Order>;
  routeInfo: Nullable<RouteInfo>;
  status: TripStatus;
  tip: Nullable<number>;
  finishedTrips: number;
  isCanceled: boolean;
  loading: {
    orderInfo: boolean;
    currentOrder: boolean;
    orderLongpolling: boolean;
    cancelTrip: boolean;
    cancelBeforePickUpLongPolling: boolean;
    cancelAfterPickUpLongPolling: boolean;
    tripSuccessfullLongPolling: boolean;
  };
  error: {
    orderInfo: Nullable<NetworkErrorDetailsWithBody<any>>;
    currentOrder: Nullable<NetworkErrorDetailsWithBody<any>>;
    orderLongpolling: Nullable<NetworkErrorDetailsWithBody<any>>;
    cancelTrip: Nullable<NetworkErrorDetailsWithBody<any>>;
    cancelBeforePickUpLongPolling: Nullable<NetworkErrorDetailsWithBody<any>>;
    cancelAfterPickUpLongPolling: Nullable<NetworkErrorDetailsWithBody<any>>;
    tripSuccessfullLongPolling: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
};
