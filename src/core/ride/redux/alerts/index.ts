import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { AlertData, type AlertsState, AlertType } from './types';

const initialState: AlertsState = {
  list: [],
};

const slice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert(state, action: PayloadAction<AlertType>) {
      state.list.push(action.payload);
    },
    removeAlert(state, action: PayloadAction<Pick<AlertData, 'id'>>) {
      state.list = state.list.filter(elem => elem.id !== action.payload.id);
    },
  },
});

export const { addAlert, removeAlert } = slice.actions;

export default slice.reducer;
