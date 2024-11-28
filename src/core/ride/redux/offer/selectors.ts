import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../../redux/store';
import { GroupedTariffs } from './types';

export const offerSelector = (state: AppState) => state.offer;
export const offerRecentDropoffsSelector = (state: AppState) => state.offer.recentDropoffs;
export const offerPointsSelector = (state: AppState) => state.offer.points;
export const offerSelectedTariffSelector = (state: AppState) => state.offer.selectedTariff;
export const isSearchAdressesLoadingSelector = (state: AppState) => state.offer.loading.searchAdresses;
export const offerAvaliableTariffsSelector = (state: AppState) =>
  state.offer.avaliableTariffs?.filter(tariff => tariff.isAvaliable);

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
