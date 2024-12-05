import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../../redux/store';
import { GroupedTariffs } from './types';

export const offerSelector = (state: AppState) => state.offer;
export const offerLoadingsSelector = (state: AppState) => state.offer.loading;
export const offerRoutesSelector = (state: AppState) => state.offer.offerRoutes;
export const offerRecentDropoffsSelector = (state: AppState) => state.offer.recentDropoffs;
export const offerPointsSelector = (state: AppState) => state.offer.points;
export const offerSelectedTariffSelector = (state: AppState) => state.offer.selectedTariff;
export const offerAvaliableTariffsSelector = (state: AppState) => state.offer.avaliableTariffs;

export const groupedTariffsSelector = createSelector(
  [offerAvaliableTariffsSelector],
  (tariffsList): GroupedTariffs => ({
    economy: {
      groupName: 'economy',
      tariffs: tariffsList?.filter(tariff => tariff.type === 'Economy'),
    },
    exclusive: {
      groupName: 'exclusive',
      tariffs: tariffsList?.filter(tariff => tariff.type === 'Comfort'),
    },
    business: {
      groupName: 'business',
      tariffs: tariffsList?.filter(tariff => tariff.type === 'Premium'),
    },
  }),
);

//Loadings
export const isSearchAdressesLoadingSelector = (state: AppState) => state.offer.loading.searchAdresses;
export const isRecentDropoffsLoadingSelector = (state: AppState) => state.offer.loading.recentDropoffs;
export const isTariffsPricesLoadingSelector = (state: AppState) => state.offer.loading.tariffsPrices;

//Errors
export const recentDropoffsErrorSelector = (state: AppState) => state.offer.errors.recentDropoffs;
export const tariffsPricesErrorSelector = (state: AppState) => state.offer.errors.tariffsPrices;
