import { LatLng } from 'react-native-maps';
import { getNetworkErrorInfo, Nullable } from 'shuttlex-integration';

import { logger } from '../../../../App';
import { profileZoneSelector } from '../../../passenger/redux/selectors';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { geolocationCoordinatesSelector } from '../geolocation/selectors';
import { convertGeoToAddress } from '../geolocation/thunks';
import { setOrderStatus } from '../order';
import { OrderStatus } from '../order/types';
import { orderSelector } from '../trip/selectors';
import { getOfferNetworkErrorInfo } from './errors';
import { setIsAvaliableTariff, updateTariffMatching } from './index';
import { offerPointsSelector, offerSelector } from './selectors';
import {
  AddressSearchPayload,
  CreateInitialOfferAPIResponse,
  CreateOfferAPIResponse,
  CreatePhantomOfferAPIResponse,
  EnhancedSearchAddress,
  EnhanceSearchAddressAPIResponse,
  GetAvailableTariffsAPIResponse,
  GetOfferRoutesAPIRequest,
  GetOfferRoutesAPIResoponse,
  GetTariffsPricesAPIResponse,
  GetTariffsPricesThunkResult,
  GetZoneIdByLocationAPIResponse,
  OfferRoutesFromAPI,
  RecentAddressAPIResponse,
  RecentDropoffsAPIResponse,
  RecentDropoffsFromAPI,
  RecentDropoffsPayload,
  SearchAddressAPIResponse,
  SearchAddressFromAPI,
  SearchAddressPayload,
  TariffFromAPI,
  ZoneIdFromAPI,
} from './types';
import { algorythmTypeParser, tariffsNamesByFeKey } from './utils';

export const getRecentDropoffs = createAppAsyncThunk<RecentDropoffsFromAPI[], RecentDropoffsPayload>(
  'offer/getRecentDropoffs',
  async (payload, { rejectWithValue, passengerAxios, getState, dispatch }) => {
    const currentLocation = geolocationCoordinatesSelector(getState());

    let urlPart = '';

    if (currentLocation) {
      urlPart = `${urlPart}&Latitude=${currentLocation.latitude}&Longitude=${currentLocation.longitude}`;
    }

    try {
      const response = await passengerAxios.get<RecentDropoffsAPIResponse>(
        `/Ride/dropoffs-recent?Amount=${payload.amount}${urlPart}`,
        {
          params: {
            SortBy: 'createdDate:desc',
          },
        },
      );
      const recentDropoffs = response.data;
      const coordinates = recentDropoffs.map(el => el.dropoffGeo);

      const fullAddresses = await Promise.all(
        coordinates.map(geo =>
          dispatch(
            convertGeoToAddress({
              latitude: geo.latitude,
              longitude: geo.longitude,
            }),
          ).unwrap(),
        ),
      );

      const enrichedDropoffs = recentDropoffs.map((dropoff, index) => ({
        ...dropoff,
        fullAddress: fullAddresses[index].fullAddress,
        id: dropoff.id,
      }));

      return enrichedDropoffs;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const searchAddress = createAppAsyncThunk<SearchAddressAPIResponse, SearchAddressPayload>(
  'offer/searchAddress',
  async (payload, { rejectWithValue, passengerAxios, getState }) => {
    const pickUp = offerPointsSelector(getState())[0].latitude
      ? offerPointsSelector(getState())[0]
      : geolocationCoordinatesSelector(getState());

    let urlPart = '';

    if (pickUp) {
      urlPart = `${urlPart}&Latitude=${pickUp.latitude}&Longitude=${pickUp.longitude}`;
    }
    try {
      const response = await passengerAxios.get<SearchAddressAPIResponse>(
        `/Ride/places/?placeOrAddress=${payload.query}&Language=${payload.language}${urlPart}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const enhanceAddress = createAppAsyncThunk<EnhancedSearchAddress, SearchAddressFromAPI>(
  'offer/enhanceAddress',
  async (payload, { rejectWithValue, passengerAxios }) => {
    try {
      const response = await passengerAxios.get<EnhanceSearchAddressAPIResponse>(`/Ride/places/${payload.id}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getAddressSearchHistory = createAppAsyncThunk<SearchAddressFromAPI[], AddressSearchPayload>(
  'offer/getAddressSearchHistory',
  async (payload, { rejectWithValue, passengerAxios }) => {
    try {
      const response = await passengerAxios.get<RecentAddressAPIResponse>(
        `/Ride/search?Amount=${payload.amount}&SortBy=updatedDate:desc`,
      );

      return response.data.map<SearchAddressFromAPI>(el => ({
        id: el.id,
        fullAddress: el.fullAddress,
        dropoffAddress: el.place,
        dropoffGeo: el.geo,
      }));
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const deleteRecentAddress = createAppAsyncThunk<void, string>(
  'offer/deleteRecentAddress',
  async (searchId, { rejectWithValue, passengerAxios }) => {
    try {
      await passengerAxios.delete(`/Ride/search/${searchId}`);
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const saveSearchResult = createAppAsyncThunk<void, EnhancedSearchAddress>(
  'offer/saveSearchResult',
  async (payload, { rejectWithValue, passengerAxios }) => {
    try {
      passengerAxios.post('/Ride/search', {
        ...payload,
        fullAddress: payload.fullAddress ?? payload.place,
      });
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getOfferRoutes = createAppAsyncThunk<OfferRoutesFromAPI, void>(
  'offer/getOfferRoutes',
  async (_, { rejectWithValue, passengerAxios, getState }) => {
    const { points } = offerSelector(getState());

    //TODO: rewrite this logic for stop points
    try {
      const response = await passengerAxios.post<GetOfferRoutesAPIResoponse>('/Ride/route/search', {
        pointA: {
          latitude: points[0].latitude,
          longitude: points[0].longitude,
        },
        pointB: {
          latitude: points[1].latitude,
          longitude: points[1].longitude,
        },
        rotationDegOnPointA: 0,
      } as GetOfferRoutesAPIRequest);

      return response.data;
    } catch (error) {
      return rejectWithValue(getOfferNetworkErrorInfo(error));
    }
  },
);

export const getZoneIdByLocation = createAppAsyncThunk<ZoneIdFromAPI, LatLng>(
  'offer/getZoneIdByLocation',
  async (payload, { rejectWithValue, configAxios }) => {
    //TODO: rewrite this logic for stop points
    try {
      const response = await configAxios.get<GetZoneIdByLocationAPIResponse>(
        `/zones/geo?Geo.Latitude=${payload.latitude}&Geo.Longitude=${payload.longitude}`,
      );

      return response.data.id;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getAvailableTariffs = createAppAsyncThunk<TariffFromAPI[] | null, void | LatLng>(
  'offer/getAvailableTariffs',
  async (payload, { rejectWithValue, configAxios, getState, dispatch }) => {
    let zoneId: Nullable<string> = null;

    const profileZoneId = profileZoneSelector(getState())?.id;
    const acceptedOfferZoneId = orderSelector(getState())?.info?.acceptedOfferZoneId;

    if (acceptedOfferZoneId) {
      zoneId = acceptedOfferZoneId;
    } else if (profileZoneId) {
      zoneId = profileZoneId;
    }

    if (payload) {
      zoneId = await dispatch(getZoneIdByLocation(payload)).unwrap();
    }

    try {
      if (zoneId) {
        const response = await configAxios.get<GetAvailableTariffsAPIResponse>(`/zones/${zoneId}/tariffs`, {
          params: {
            SortBy: 'index:asc',
          },
        });

        const tariffsWithMapedName = response.data.map<TariffFromAPI>(tariff => ({
          ...tariff,
          name: tariffsNamesByFeKey[tariff.feKey],
          type: tariff.type,
        }));

        return tariffsWithMapedName;
      } else {
        logger.error(`Wrong url path. getAvailableTariffs thunk uzes zoneId = ${zoneId}`);
        return null;
      }
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const createPhantomOffer = createAppAsyncThunk<void, void>(
  'offer/createPhantomOffer',
  async (_, { rejectWithValue, matchingAxios, getState, dispatch }) => {
    const { points, avaliableTariffs } = offerSelector(getState());

    const urlPart = `&Latitude=${points[0].latitude}&Longitude=${points[0].longitude}`;

    try {
      if (avaliableTariffs) {
        const requests = avaliableTariffs.map(tariff =>
          matchingAxios.get<CreatePhantomOfferAPIResponse>(`/offers/phantom?TariffId=${tariff.id}${urlPart}`),
        );
        const responses = await Promise.allSettled(requests);

        responses.forEach((response, index) => {
          if (response.status === 'fulfilled') {
            dispatch(setIsAvaliableTariff({ tariffId: avaliableTariffs[index].id, isAvaliable: true }));
            dispatch(
              updateTariffMatching(
                response.value.data.map(el => ({
                  tariffid: avaliableTariffs[index].id,
                  algorythmType: algorythmTypeParser(el.algorythmType),
                  durationSeconds: el.durationSec === null ? 0 : el.durationSec,
                })),
              ),
            );
          } else {
            dispatch(setIsAvaliableTariff({ tariffId: avaliableTariffs[index].id, isAvaliable: false }));
          }
        });
      }
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getTariffsPrices = createAppAsyncThunk<GetTariffsPricesThunkResult, void>(
  'offer/getTariffsPrices',
  async (_, { rejectWithValue, cashieringAxios, getState }) => {
    const state = getState();

    //TODO: Add offer zoneId from BE
    const zoneId = state.offer.zoneId ?? state.passenger.zone?.id;

    try {
      if (state.offer.offerRoutes && zoneId) {
        const response = await cashieringAxios.get<GetTariffsPricesAPIResponse>(
          `/cashiering/ride/routes/${state.offer.offerRoutes.routeId}/zones/${zoneId}/cost`,
        );

        return response.data;
      } else {
        logger.error('Something wrong with the route in getTariffsPrices thunk', zoneId);
        return null;
      }
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const createInitialOffer = createAppAsyncThunk<string, void>(
  'offer/createInitialOffer',
  async (_, { rejectWithValue, passengerAxios, getState, dispatch }) => {
    const { points, selectedTariff, offerRoutes } = offerSelector(getState());

    //todo: change payment method to real one
    //todo: ask backend to do endpoint for currency

    let pickUpPoint = points[0];

    const route = await dispatch(getOfferRoutes()).unwrap();

    if (pickUpPoint.address === '') {
      const addressWithFullInfo = await dispatch(
        convertGeoToAddress({ longitude: pickUpPoint.longitude, latitude: pickUpPoint.latitude }),
      ).unwrap();

      pickUpPoint = {
        ...pickUpPoint,
        address: addressWithFullInfo.place,
        fullAddress: addressWithFullInfo.fullAddress,
      };
    }

    const bodyPart = {
      routeId: route.routeId,
      tariffId: selectedTariff?.id,
      paymentMethod: 'Cash',
      pickUpGeo: {
        latitude: pickUpPoint.latitude,
        longitude: pickUpPoint.longitude,
      },
      pickUpZoneId: offerRoutes?.waypoints[0].zoneId,
      pickUpFullAddress: pickUpPoint.fullAddress ?? pickUpPoint.address,
      pickUpPlace: pickUpPoint.address,
      dropOffGeo: {
        latitude: points[1].latitude,
        longitude: points[1].longitude,
      },
      dropOffZoneId: offerRoutes?.waypoints[0].zoneId,
      dropOffFullAddress: points[1].fullAddress,
      dropOffPlace: points[1].address,
    };

    try {
      const response = await passengerAxios.post<CreateInitialOfferAPIResponse>('/Offer/create/initial', bodyPart);

      return response.data.id;
    } catch (error) {
      return rejectWithValue(getOfferNetworkErrorInfo(error));
    }
  },
);

export const createOffer = createAppAsyncThunk<string, string>(
  'offer/createOffer',
  async (payload, { rejectWithValue, passengerAxios }) => {
    try {
      const response = await passengerAxios.post<CreateOfferAPIResponse>(`/Offer/create/continue?offerId=${payload}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const cancelOffer = createAppAsyncThunk<void, void>(
  'offer/cancelOffer',
  async (_, { rejectWithValue, passengerAxios, getState, dispatch }) => {
    try {
      await passengerAxios.put(`/Offer/cancel/${getState().offer.offerId}`);

      dispatch(setOrderStatus(OrderStatus.Payment));
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
