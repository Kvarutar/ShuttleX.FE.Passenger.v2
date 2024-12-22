import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import { cancelTrip } from '../trip/thunks';
import {
  createInitialOffer,
  createOffer,
  createPhantomOffer,
  getAvailableTariffs,
  getOfferRoutes,
  getRecentDropoffs,
  getTariffsPrices,
  getZoneIdByLocation,
  searchAddress,
} from './thunks';
import {
  AddressPoint,
  EstimatedPrice,
  Matching,
  MatchingFromAPI,
  OfferRoutesFromAPI,
  OfferState,
  RecentDropoffsAPIResponse,
  SelectedTariff,
  TariffsPricesFromAPI,
  ZoneIdFromAPI,
} from './types';

const initialState: OfferState = {
  offerId: null,
  recentDropoffs: [],
  // TODO: rewrite this (need to be empty array)
  points: [
    { id: 0, address: '', fullAddress: '', longitude: 0, latitude: 0 },
    { id: 1, address: '', fullAddress: '', longitude: 0, latitude: 0 },
  ],
  offerRoutes: null,
  loading: {
    searchAdresses: false,
    avaliableTariffs: false,
    offerRoutes: false,
    recentDropoffs: false,
    tariffsPrices: false,
    offerCreate: false,
    isCityAvailable: false,
    phantomOffer: false,
  },
  zoneId: null,
  avaliableTariffs: null,
  errors: {
    avaliableTariffs: null,
    offerRoutes: null,
    recentDropoffs: null,
    tariffsPrices: null,
    offerCreate: null,
  },
  selectedTariff: null,
  estimatedPrice: null,
  isCityAvailable: null,
};

const slice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setOfferId(state, action: PayloadAction<string>) {
      state.offerId = action.payload;
    },
    addRecentDropoff(state, action: PayloadAction<RecentDropoffsAPIResponse>) {
      state.recentDropoffs.unshift(...action.payload);
    },
    setTripTariff(state, action: PayloadAction<SelectedTariff>) {
      state.selectedTariff = action.payload;
    },
    updateTariffMatching(state, action: PayloadAction<MatchingFromAPI[]>) {
      if (state.avaliableTariffs && action.payload.length > 0) {
        const tariffToUpdateIndex = state.avaliableTariffs.findIndex(
          tariff => tariff.id === action.payload[0].tariffid,
        );

        if (tariffToUpdateIndex !== -1) {
          const newMatching: Matching[] = action.payload.map(el => ({
            durationSec: el.durationSeconds,
            algorythm: el.algorythmType,
            cost: null,
          }));
          state.avaliableTariffs[tariffToUpdateIndex].matching = newMatching;
        }
      }
    },
    //TODO: rewrite logic for different algorythms
    updateTariffsCost(state, action: PayloadAction<TariffsPricesFromAPI[]>) {
      action.payload.forEach(tariffWithCost => {
        if (state.avaliableTariffs !== null) {
          const tariffToUpdateIdx = state.avaliableTariffs.findIndex(tariff => tariff.id === tariffWithCost.tariffId);

          if (tariffToUpdateIdx !== -1 && tariffToUpdateIdx !== undefined) {
            state.avaliableTariffs[tariffToUpdateIdx].matching[0].cost = Number(tariffWithCost.cost);
          }
        }
      });
    },
    setIsAvaliableTariff(state, action: PayloadAction<{ tariffId: string; isAvaliable: boolean }>) {
      if (state.avaliableTariffs) {
        const tariffToUpdateIndex = state.avaliableTariffs.findIndex(tariff => tariff.id === action.payload.tariffId);

        if (tariffToUpdateIndex !== -1) {
          state.avaliableTariffs[tariffToUpdateIndex].isAvaliable = action.payload.isAvaliable;
        }
      }
    },
    addOfferPoint(state, action: PayloadAction<AddressPoint>) {
      state.points.push(action.payload);
    },
    removeOfferPoint(state, action: PayloadAction<number>) {
      state.points = state.points.filter(point => point.id !== action.payload);
    },
    updateOfferPoint(state, action: PayloadAction<AddressPoint>) {
      const pointIndex = state.points.findIndex(point => point.id === action.payload.id);

      if (pointIndex !== -1) {
        state.points[pointIndex] = action.payload;
      }
    },
    cleanOfferPoints(state) {
      state.points = initialState.points;
    },
    setOfferRoutes(state, action: PayloadAction<OfferRoutesFromAPI>) {
      state.offerRoutes = action.payload;
    },
    setEstimatedPrice(state, action: PayloadAction<Nullable<EstimatedPrice>>) {
      state.estimatedPrice = action.payload;
    },
    clearOffer(state) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = initialState;
    },
    setOfferRoutesLoading(state, action: PayloadAction<boolean>) {
      state.loading.offerRoutes = action.payload;
    },
    setTariffsPricesLoading(state, action: PayloadAction<boolean>) {
      state.loading.tariffsPrices = action.payload;
    },
    setPhantomOfferLoading(state, action: PayloadAction<boolean>) {
      state.loading.phantomOffer = action.payload;
    },
    setOfferZoneId(state, action: PayloadAction<ZoneIdFromAPI>) {
      state.zoneId = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getRecentDropoffs.pending, state => {
        state.loading.recentDropoffs = true;
        state.errors.recentDropoffs = null;
      })
      .addCase(getRecentDropoffs.fulfilled, (state, action) => {
        state.recentDropoffs = action.payload;
        state.loading.recentDropoffs = false;
        state.errors.recentDropoffs = null;
      })
      .addCase(getRecentDropoffs.rejected, (state, action) => {
        state.loading.recentDropoffs = false;
        state.errors.recentDropoffs = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(searchAddress.pending, state => {
        state.loading.searchAdresses = true;
      })
      .addCase(searchAddress.fulfilled, state => {
        state.loading.searchAdresses = false;
      })
      .addCase(searchAddress.rejected, state => {
        state.loading.searchAdresses = false;
      })
      .addCase(getAvailableTariffs.pending, state => {
        state.loading.avaliableTariffs = true;
      })
      .addCase(getAvailableTariffs.fulfilled, (state, action) => {
        if (action.payload) {
          state.avaliableTariffs = action.payload.map(tariff => ({ ...tariff, matching: [], isAvaliable: false }));
        }
        state.loading.avaliableTariffs = false;
      })
      .addCase(getAvailableTariffs.rejected, (state, action) => {
        state.loading.avaliableTariffs = false;
        state.errors.avaliableTariffs = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getTariffsPrices.pending, state => {
        state.loading.tariffsPrices = true;
        state.errors.tariffsPrices = null;
      })
      .addCase(getTariffsPrices.fulfilled, (state, action) => {
        if (action.payload) {
          slice.caseReducers.updateTariffsCost(state, {
            payload: action.payload,
            type: updateTariffsCost.type,
          });
        }
        state.loading.tariffsPrices = false;
      })
      .addCase(getTariffsPrices.rejected, (state, action) => {
        state.loading.tariffsPrices = false;
        state.errors.tariffsPrices = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getOfferRoutes.pending, state => {
        slice.caseReducers.setOfferRoutesLoading(state, {
          payload: true,
          type: setOfferRoutesLoading.type,
        });
        state.errors.offerRoutes = null;
      })
      .addCase(getOfferRoutes.fulfilled, (state, action) => {
        slice.caseReducers.setOfferRoutes(state, {
          payload: action.payload,
          type: setOfferRoutes.type,
        });
        slice.caseReducers.setOfferRoutesLoading(state, {
          payload: false,
          type: setOfferRoutesLoading.type,
        });
        state.errors.offerRoutes = null;
      })
      .addCase(getOfferRoutes.rejected, (state, action) => {
        slice.caseReducers.setOfferRoutesLoading(state, {
          payload: false,
          type: setOfferRoutesLoading.type,
        });
        state.errors.offerRoutes = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      // offerCreate
      .addCase(createInitialOffer.pending, state => {
        state.loading.offerCreate = true;
        state.errors.offerCreate = null;
      })
      .addCase(createInitialOffer.fulfilled, (state, action) => {
        slice.caseReducers.setOfferId(state, {
          payload: action.payload,
          type: setOfferId.type,
        });
        state.loading.offerCreate = false;
        state.errors.offerCreate = null;
      })
      //TODO: uncomment after payment will be done
      // .addCase(createInitialOffer.rejected, (state, action) => {
      //   store.dispatch(createOffer());
      //   state.loading.offerCreate = false;
      //   state.errors.offerCreate = action.payload as NetworkErrorDetailsWithBody<any>;
      // })
      .addCase(createOffer.pending, state => {
        state.loading.offerCreate = true;
        state.errors.offerCreate = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        slice.caseReducers.setOfferId(state, {
          payload: action.payload,
          type: setOfferId.type,
        });
        state.loading.offerCreate = false;
        state.errors.offerCreate = null;
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading.offerCreate = false;
        state.errors.offerCreate = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      .addCase(cancelTrip.fulfilled, state => {
        slice.caseReducers.clearOffer(state);
      })
      .addCase(getZoneIdByLocation.pending, state => {
        state.loading.isCityAvailable = true;
      })
      .addCase(getZoneIdByLocation.fulfilled, (state, action) => {
        slice.caseReducers.setOfferZoneId(state, {
          payload: action.payload,
          type: setOfferZoneId.type,
        });

        state.isCityAvailable = action.payload !== null;
        state.loading.isCityAvailable = false;
      })
      .addCase(getZoneIdByLocation.rejected, state => {
        state.loading.isCityAvailable = false;
      })
      .addCase(createPhantomOffer.pending, state => {
        slice.caseReducers.setPhantomOfferLoading(state, {
          payload: true,
          type: setPhantomOfferLoading.type,
        });
      })
      .addCase(createPhantomOffer.rejected, state => {
        slice.caseReducers.setPhantomOfferLoading(state, {
          payload: false,
          type: setPhantomOfferLoading.type,
        });
      })
      .addCase(createPhantomOffer.fulfilled, state => {
        slice.caseReducers.setPhantomOfferLoading(state, {
          payload: false,
          type: setPhantomOfferLoading.type,
        });
      });
  },
});

export const {
  addRecentDropoff,
  setOfferZoneId,
  setTripTariff,
  addOfferPoint,
  removeOfferPoint,
  updateOfferPoint,
  cleanOfferPoints,
  updateTariffMatching,
  setIsAvaliableTariff,
  setOfferRoutes,
  updateTariffsCost,
  clearOffer,
  setOfferRoutesLoading,
  setOfferId,
  setEstimatedPrice,
  setTariffsPricesLoading,
  setPhantomOfferLoading,
} = slice.actions;

export default slice.reducer;
