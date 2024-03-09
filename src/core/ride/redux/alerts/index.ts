import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { AlertData, type AlertsState, AlertType, AlertTypeWithOptionalId } from './types';

const initialState: AlertsState = {
  list: [],
};

const slice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert(state, action: PayloadAction<AlertTypeWithOptionalId>) {
      if (action.payload.id === undefined) {
        const generatedId = uuidv4();
        state.list.push({ ...action.payload, id: generatedId });
      } else {
        state.list.push(action.payload as AlertType);
      }
    },
    removeAlert(state, action: PayloadAction<Pick<AlertData, 'id'>>) {
      state.list = state.list.filter(elem => elem.id !== action.payload.id);
    },
  },
});

export const { addAlert, removeAlert } = slice.actions;

export default slice.reducer;
