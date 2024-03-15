import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '../../../redux/store';

export const notificationsListSelector = (state: AppState) => state.notifications.list;

export const numberOfUnreadNotificationsSelector = createSelector([notificationsListSelector], notificationsList => {
  return notificationsList.filter(notification => !notification.isRead).length;
});
