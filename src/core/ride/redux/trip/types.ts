import { LatLng } from 'react-native-maps';
import { NetworkErrorDetailsWithBody, Nullable, TariffType } from 'shuttlex-integration';

import { AddressPoint, TariffFromAPI } from '../offer/types';

export type TripStateFromAPI =
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
  arrivedToPickUpDate: Nullable<string>;
  finishedDate: string;
  dropOffRouteId: string;
  pickUpRouteId: string;
  pickUpFullAddress: string;
  pickUpPlace: string;
  pickUpDate: string;
  dropOffFullAddress: string;
  dropOffPlace: string;
  state: TripStateFromAPI;
  totalFinalPrice: number;
  tariffId: string;
  passengerId: string;
  estimatedPrice: number;
  createdDate: string;
  acceptedOfferZoneId: string;
  waitingTimeInMilSec: number;
  freeWaitingTimeMin: number;
  paidWaitingTimeFeePricePerMin: number;
};

export type Order = {
  info: Nullable<OrderFromAPI>;
  avatar: Nullable<string>;
  orderId: string;
};

export type OrderWithTariffInfo = Order & { tariffInfo: TariffFromAPI };

export type GetCurrentOrderAPIResponse = OrderFromAPI;
export type GetOrderInfoAPIResponse = OrderFromAPI;

export type TrafficLoadFromAPI = 'Low' | 'Average' | 'High';

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
    trafficLoad: TrafficLoadFromAPI;
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
export type TripArivedLongPollingAPIResponse = LongPollingAPIResponse;
export type TripCanceledAfterPickupLongPollingAPIResponse = LongPollingAPIResponse;
export type TripInPickupLongPollingAPIResponse = LongPollingInSomePointAPIResponse;
export type TripInStopPointAPIResponse = LongPollingInSomePointAPIResponse;
export type TripInDropOffAPIResponse = LongPollingInSomePointAPIResponse;

export type GetTariffInfoByIdAPIResponse = TariffFromAPI;

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
  order: Nullable<OrderWithTariffInfo>;
  routeInfo: Nullable<RouteInfo>;
  status: TripStatus;
  tip: Nullable<number>;
  finishedTrips: number;
  isCanceled: boolean;
  isOrderCanceled: boolean;
  ui: {
    isOrderCanceledAlertVisible: boolean;
  };
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
