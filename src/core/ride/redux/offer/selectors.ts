import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../../redux/store';
import { AddressPoint, GroupedTariffs, TariffWithMatching } from './types';

export const offerSelector = (state: AppState) => state.offer;
export const offerIdSelector = (state: AppState) => state.offer.offerId;

export const offerLoadingsSelector = (state: AppState) => state.offer.loading;
export const offerIsTariffsPricesLoadingSelector = (state: AppState) => state.offer.loading.tariffsPrices;
export const isPhantomOfferLoadingSelector = (state: AppState) => state.offer.loading.phantomOffer;

export const offerRouteSelector = (state: AppState) => state.offer.offerRoute;
export const offerRecentDropoffsSelector = (state: AppState) => state.offer.recentDropoffs;
export const offerPointsSelector = (state: AppState) => state.offer.points;
export const offerSelectedTariffSelector = (state: AppState) => state.offer.selectedTariff;
export const offerAvaliableTariffsSelector = (state: AppState) => state.offer.avaliableTariffs;
export const isCityAvailableSelector = (state: AppState) => state.offer.isCityAvailable;
export const currentSelectedTariffSelector = (state: AppState) => state.offer.currentSelectedTariff;

//UI
export const isTooShortRouteLengthPopupVisibleSelector = (state: AppState) =>
  state.offer.ui.isTooShortRouteLengthPopupVisible;
export const isTooManyRidesPopupVisibleSelector = (state: AppState) => state.offer.ui.isTooManyRidesPopupVisible;
export const isAllOfferPointsFilledSelector = (state: AppState) => state.offer.isAllOfferPointsFilled;

//Loadings
export const isSearchAdressesLoadingSelector = (state: AppState) => state.offer.loading.searchAdresses;
export const isRecentDropoffsLoadingSelector = (state: AppState) => state.offer.loading.recentDropoffs;
export const isTariffsPricesLoadingSelector = (state: AppState) => state.offer.loading.tariffsPrices;
export const isAvailableTariffsLoadingSelector = (state: AppState) => state.offer.loading.avaliableTariffs;
export const isOfferRouteLoadingSelector = (state: AppState) => state.offer.loading.offerRoute;
export const isOfferCreateLoadingSelector = (state: AppState) => state.offer.loading.offerCreate;
export const isCityAvailableLoadingSelector = (state: AppState) => state.offer.loading.isCityAvailable;

//Errors
export const recentDropoffsErrorSelector = (state: AppState) => state.offer.errors.recentDropoffs;
export const tariffsPricesErrorSelector = (state: AppState) => state.offer.errors.tariffsPrices;
export const offerRouteErrorSelector = (state: AppState) => state.offer.errors.offerRoute;
export const offerCreateErrorSelector = (state: AppState) => state.offer.errors.offerCreate;

export const tariffByIdSelector = createSelector(
  [offerAvaliableTariffsSelector, (_, tariffId: string | undefined) => tariffId],
  (tariffsList, tariffId): TariffWithMatching | undefined => tariffsList?.find(el => el.id === tariffId),
);

export const offerPointByIdSelector = createSelector(
  [offerPointsSelector, (_, pointId: number) => pointId],
  (points, pointId): AddressPoint | undefined => points.find(point => point.id === pointId),
);

export const groupedTariffsSelector = createSelector(
  [offerAvaliableTariffsSelector],
  (tariffsList): GroupedTariffs => ({
    economy: {
      groupName: 'economy',
      tariffs: tariffsList?.filter(tariff => tariff.type === 'Economy'),
    },
    comfort: {
      groupName: 'comfort',
      tariffs: tariffsList?.filter(tariff => tariff.type === 'Comfort'),
    },
    business: {
      groupName: 'business',
      tariffs: tariffsList?.filter(tariff => tariff.type === 'Premium'),
    },
  }),
);

export const minDurationTariffSelector = createSelector(
  [groupedTariffsSelector],
  groupedTariffs =>
    Object.values(groupedTariffs)
      .flatMap(item => item.tariffs)
      .filter(item => item?.time !== 0)
      .sort((a, b) => {
        const aDuration = a?.time ?? 0;
        const bDuration = b?.time ?? 0;
        return aDuration - bDuration;
      })[0],
);

export const offerRouteFirstWaypointSelector = createSelector([offerRouteSelector], route => route?.waypoints[0]);
export const offerRouteLastWaypointSelector = createSelector(
  [offerRouteSelector],
  route => route?.waypoints[route.waypoints.length - 1],
);
