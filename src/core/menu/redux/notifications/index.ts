import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from 'shuttlex-integration';

import { NotificationsState } from './types';

const initialState: NotificationsState = {
  list: [],
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.list.unshift(action.payload);
    },
    setNotificationList(state, action: PayloadAction<Notification[]>) {
      state.list = action.payload;
    },
  },
});

export const { addNotification, setNotificationList } = slice.actions;

export default slice.reducer;
