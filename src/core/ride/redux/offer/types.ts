import { LatLng } from 'react-native-maps';
import { NetworkErrorDetailsWithBody, Nullable, TariffType } from 'shuttlex-integration';

import { TrafficLoadFromAPI } from '../trip/types';

export type SearchAddressFromAPI = {
  id?: string;
  fullAddress: string;
  dropoffGeo: LatLng;
  dropoffAddress: string;
  totalDistanceMtr?: number;
};

export type RecentDropoffsFromAPI = {
  id?: string;
  fullAddress: string;
  dropoffGeo: LatLng;
  dropoffAddress: string;
  totalDistanceMtr?: number;
};

export type RecentDropoffsAPIResponse = RecentDropoffsFromAPI[];

export type RecentDropoffsPayload = {
  amount: number;
};

export type AddressPoint = { id: number; address: string; fullAddress: string } & LatLng;

export type Address = AddressPoint & { details?: string };

export type EstimatedPrice = {
  value: Nullable<number>;
  currencyCode: string;
};

export type OfferStateFromAPI =
  | 'None'
  | 'Canceled'
  | 'NoContractorsAvailable'
  | 'RideIsUnavailable'
  | 'CashieringActionRequired'
  | 'InMatching'
  | 'WaitingForAcceptance'
  | 'DelayTrip'
  | 'OrderApplied';

export type OfferTypeFromAPI = {
  id: string;
  state: OfferStateFromAPI;
  pickUpGeo: LatLng;
  pickUpZoneId: string;
  pickUpPlace: string;
  dropOffGeo: LatLng;
  dropOffZoneId: string;
  dropOffPlace: string;
  tariffId: string;
  paymentMethod: string;
  estimatedPrice: number;
  currencyCode: string;
  estimatedDropOffDate: string;
  estimatedTotalDistanceKm: number;
  searchRadiusFactor: number;
  passengerId: string;
  createdDate: string;
  updatedDate: string;
  pickUpFullAddress: string;
  dropOffFullAddress: string;
};

export type GetActiveOffersAPIResponse = OfferTypeFromAPI[];

export type OfferState = {
  offerId: Nullable<string>;
  recentDropoffs: RecentDropoffsFromAPI[];
  points: AddressPoint[];
  isAllOfferPointsFilled: boolean;
  loading: {
    searchAdresses: boolean;
    avaliableTariffs: boolean;
    offerRoute: boolean;
    recentDropoffs: boolean;
    tariffsPrices: boolean;
    offerCreate: boolean;
    isCityAvailable: boolean;
    phantomOffer: boolean;
  };
  errors: {
    avaliableTariffs: Nullable<NetworkErrorDetailsWithBody<any>>;
    offerRoute: Nullable<NetworkErrorDetailsWithBody<any>>;
    recentDropoffs: Nullable<NetworkErrorDetailsWithBody<any>>;
    tariffsPrices: Nullable<NetworkErrorDetailsWithBody<any>>;
    offerCreate: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
  ui: {
    isTooShortRouteLengthPopupVisible: boolean;
    isTooManyRidesPopupVisible: boolean;
  };
  offerRoute: Nullable<OfferRouteFromAPI>;
  avaliableTariffs: Nullable<TariffWithMatching[]>;
  selectedTariff: Nullable<SelectedTariff>;
  currentSelectedTariff: Nullable<SelectedTariff>;
  estimatedPrice: Nullable<EstimatedPrice>;
  isCityAvailable: Nullable<boolean>;
  zoneId: Nullable<string>;
};

export type SelectedTariff = TariffWithMatching;

export type AddressSearchPayload = {
  amount: number;
};

export type SaveSearchResultPayload = Omit<SearchAddressFromAPI, 'totalDistanceMtr'>;

export type RecentAddressAPIResponse = {
  id: string;
  fullAddress: string;
  place: string;
  geo: LatLng;
}[];

export type SearchAddressPayload = {
  query: string;
  language: string;
};

export type SearchAddressAPIResponse = {
  mainText: string;
  secondaryText: string;
  externalId: string;
  distanceMtr: number;
}[];

export type EnhancedSearchAddress = EnhanceSearchAddressAPIResponse;

export type EnhanceSearchAddressAPIResponse = {
  fullAddress: string;
  place: string;
  geo: LatLng;
  country: string;
  countryCode: string;
  region: string;
  cityOrLocality: string;
};

export type OfferRouteFromAPI = {
  routeId: string;
  totalDistanceMtr: number;
  totalDurationSec: number;
  waypoints: {
    geo: LatLng;
    index: number;
    zoneId: string;
  }[];
  legs: {
    accurateGeometries: {
      polylineStartIndex: number;
      polylineEndIndex: number;
      trafficLoad: TrafficLoadFromAPI;
    }[];
    durationSec: number;
    distanceMtr: number;
    geometry: string;
    trafficLoad: string;
    index: number;
  }[];
};

export type GetOfferRouteAPIResoponse = OfferRouteFromAPI;
export type GetOfferRouteAPIRequest = {
  pointA: LatLng;
  pointB: LatLng;
};

export type TariffFromAPI = {
  id: string;
  name: TariffType;
  feKey: TariffFeKeyFromAPI;
  currencyCode: string;
  freeWaitingTimeMin: number;
  paidWaitingTimeFeePriceMin: number;
  maxSeatsCount: number;
  maxLuggagesCount: number;
  type: TariffsTypeFromAPI;
  index: number;
};

//TODO: dumb logic while backend don't have normal way for algorythms
export type TariffWithMatching = TariffFromAPI & {
  cost: number | null;
  time: number | null;
  currency: string | null;
  matching: Matching[];
  isAvaliable: boolean;
};

export type GetAvailableTariffsAPIResponse = TariffFromAPI[];

export type TariffFeKeyFromAPI =
  | 'basicx'
  | 'basicxl'
  | 'comfortplus'
  | 'electric'
  | 'businessx'
  | 'businesselite'
  | 'comforteco';

export type TariffsType = 'economy' | 'comfort' | 'business';
export type TariffsTypeFromAPI = 'Economy' | 'Comfort' | 'Premium';

export type TariffCategory = { groupName: TariffsType } & { tariffs: TariffWithMatching[] | undefined };

export type GroupedTariffs = Record<TariffsType, TariffCategory>;

export type MatchingAlgorythm = 'Eager Fast' | 'Hungarian' | 'Eager Cheap';
export type Matching = {
  algorythm: MatchingAlgorythm;
  durationSec: Nullable<number>;
  cost: Nullable<number>;
  currency: string;
};

export type MatchingFromAPI = {
  tariffid: string;
  algorythmType: 'Eager Fast' | 'Hungarian' | 'Eager Cheap';
  durationSeconds: number;
};

export type CreatePhantomOfferAPIResponse = {
  tariffid: string;
  algorythmType: number;
  durationSec: Nullable<number>;
}[];

export type TariffsPricesFromAPI = {
  tariffId: string;
  cost: string;
  currency: string;
};

export type GetTariffsPricesAPIResponse = TariffsPricesFromAPI[];

export type GetTariffsPricesThunkResult = Nullable<GetTariffsPricesAPIResponse>;

export type CreateInitialOfferAPIResponse = {
  id: string;
};

export type CreateOfferAPIResponse = string;

export type GetZoneIdByLocationAPIResponse = { id: Nullable<string> };

export type ZoneIdFromAPI = Nullable<string>;
