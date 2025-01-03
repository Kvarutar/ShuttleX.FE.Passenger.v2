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

export type OfferState = {
  offerId: Nullable<string>;
  recentDropoffs: RecentDropoffsFromAPI[];
  points: AddressPoint[];
  loading: {
    searchAdresses: boolean;
    avaliableTariffs: boolean;
    offerRoutes: boolean;
    recentDropoffs: boolean;
    tariffsPrices: boolean;
    offerCreate: boolean;
    isCityAvailable: boolean;
    phantomOffer: boolean;
  };
  errors: {
    avaliableTariffs: Nullable<NetworkErrorDetailsWithBody<any>>;
    offerRoutes: Nullable<NetworkErrorDetailsWithBody<any>>;
    recentDropoffs: Nullable<NetworkErrorDetailsWithBody<any>>;
    tariffsPrices: Nullable<NetworkErrorDetailsWithBody<any>>;
    offerCreate: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
  offerRoutes: Nullable<OfferRoutesFromAPI>;
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

export type OfferRoutesFromAPI = {
  routeId: string;
  totalDistanceMtr: number;
  totalDurationSec: number;
  waypoints: {
    geo: LatLng;
    index: number;
    zoneId: string;
  }[];
  accurateGeometries: {
    polylineStartIndex: number;
    polylineEndIndex: number;
    trafficLoad: TrafficLoadFromAPI;
  }[];
  geometry: string;
  trafficLoad: string;
};

export type GetOfferRoutesAPIResoponse = OfferRoutesFromAPI;
export type GetOfferRoutesAPIRequest = {
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

export type TariffWithMatching = TariffFromAPI & { matching: Matching[]; isAvaliable: boolean };

export type GetAvailableTariffsAPIResponse = TariffFromAPI[];

//TODO: add "premiumx", "premiumxl" or "business" if necessary
export type TariffFeKeyFromAPI = 'basicx' | 'basicxl' | 'comfortplus' | 'electric';

//TODO: Add 'business' when work with this type
export type TariffsType = 'economy' | 'comfort';
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
