import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from 'react-native-maps';

import { SignalRState } from './types';

const initialState: SignalRState = {
  contractorCoordinates: null,
  contractorsCars: [],
};

const slice = createSlice({
  name: 'signalr',
  initialState,
  reducers: {
    connectSignalR() {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSignalRAccessToken(_, action: PayloadAction<string>) {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getContractorsCars(_, action: PayloadAction<LatLng>) {},
    clearContractorCoordinates(state) {
      state.contractorCoordinates = null;
    },
  },
});

export const { connectSignalR, getContractorsCars, updateSignalRAccessToken, clearContractorCoordinates } =
  slice.actions;

export default slice.reducer;
