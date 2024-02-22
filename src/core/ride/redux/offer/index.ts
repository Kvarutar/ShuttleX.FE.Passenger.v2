import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TariffType } from 'shuttlex-integration';

import { OfferState, OfferStatus } from './types';

const initialState: OfferState = {
  status: OfferStatus.StartRide,
  tripTariff: null,
};

const slice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setOfferStatus(state, action: PayloadAction<OfferStatus>) {
      state.status = action.payload;
    },
    setTripTariff(state, action: PayloadAction<TariffType>) {
      state.tripTariff = action.payload;
    },
  },
});

export const { setOfferStatus, setTripTariff } = slice.actions;

export default slice.reducer;
