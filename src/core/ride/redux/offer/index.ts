import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import { createOffer, getAvaliableTariffs, getOfferRoutes, getRecentDropoffs, searchAddress } from './thunks';
import {
  AddressPoint,
  EstimatedPrice,
  Matching,
  MatchingFromAPI,
  OfferRoutesFromAPI,
  OfferState,
  SearchAddressFromAPI,
  SelectedTariff,
  TariffsPricesFromAPI,
} from './types';

const initialState: OfferState = {
  offerId: null,
  recentDropoffs: [],
  points: [
    { id: 0, address: '', fullAdress: '', longitude: 0, latitude: 0 },
    { id: 1, address: '', fullAdress: '', longitude: 0, latitude: 0 },
  ],
  offerRoutes: null,
  loading: {
    searchAdresses: false,
    avaliableTariffs: false,
    offerRoutes: false,
  },
  avaliableTariffs: null,
  errors: {
    avaliableTariffs: null,
  },
  selectedTariff: null,
  estimatedPrice: null,
};

const slice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setOfferId(state, action: PayloadAction<string>) {
      state.offerId = action.payload;
    },
    addRecentDropoff(state, action: PayloadAction<SearchAddressFromAPI>) {
      state.recentDropoffs.unshift(action.payload);
    },
    setTripTariff(state, action: PayloadAction<SelectedTariff>) {
      state.selectedTariff = action.payload;
    },
    updateTariffMathcing(state, action: PayloadAction<MatchingFromAPI[]>) {
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
  },
  extraReducers: builder => {
    builder
      .addCase(getRecentDropoffs.fulfilled, (state, action) => {
        state.recentDropoffs = action.payload;
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
      .addCase(getAvaliableTariffs.pending, state => {
        state.loading.avaliableTariffs = true;
      })
      .addCase(getAvaliableTariffs.fulfilled, (state, action) => {
        if (action.payload) {
          state.avaliableTariffs = action.payload.map(tariff => ({ ...tariff, matching: [], isAvaliable: false }));
          state.loading.avaliableTariffs = false;
        }
      })
      .addCase(getAvaliableTariffs.rejected, (state, action) => {
        state.loading.avaliableTariffs = false;
        state.errors.avaliableTariffs = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getOfferRoutes.pending, state => {
        slice.caseReducers.setOfferRoutesLoading(state, {
          payload: true,
          type: setOfferRoutes.type,
        });
      })
      .addCase(getOfferRoutes.fulfilled, (state, action) => {
        slice.caseReducers.setOfferRoutes(state, {
          payload: action.payload,
          type: setOfferRoutes.type,
        });
        slice.caseReducers.setOfferRoutesLoading(state, {
          payload: false,
          type: setOfferRoutes.type,
        });
      })
      .addCase(getOfferRoutes.rejected, state => {
        slice.caseReducers.setOfferRoutesLoading(state, {
          payload: false,
          type: setOfferRoutes.type,
        });
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        slice.caseReducers.setOfferId(state, {
          payload: action.payload,
          type: setOfferId.type,
        });
      });
  },
});

export const {
  addRecentDropoff,
  setTripTariff,
  addOfferPoint,
  removeOfferPoint,
  updateOfferPoint,
  cleanOfferPoints,
  updateTariffMathcing,
  setIsAvaliableTariff,
  setOfferRoutes,
  updateTariffsCost,
  clearOffer,
  setOfferId,
  setEstimatedPrice,
} = slice.actions;

export default slice.reducer;
