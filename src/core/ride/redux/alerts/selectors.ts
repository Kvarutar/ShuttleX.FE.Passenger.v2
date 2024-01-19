import { createSelector } from '@reduxjs/toolkit';

import { type AppState } from '../../../redux/store';

const alertsListSelector = (state: AppState) => state.alerts.list;

export const twoHighestPriorityAlertsSelector = createSelector([alertsListSelector], alertsList => {
  const list = alertsList.slice(); // shallow copy
  list.sort((a, b) => a.priority - b.priority); // from lowest to highest priority
  return list.slice(-2);
});
