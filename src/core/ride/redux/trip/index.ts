import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { ContractorInfo, TripState, TripStatus } from './types';

const initialState: TripState = {
  contractor: null,
  status: TripStatus.Idle,
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setContractorInfo(state, action: PayloadAction<ContractorInfo>) {
      state.contractor = action.payload;
    },
    setTripStatus(state, action: PayloadAction<TripStatus>) {
      state.status = action.payload;
    },
  },
});

export const { setContractorInfo, setTripStatus } = slice.actions;

export default slice.reducer;
