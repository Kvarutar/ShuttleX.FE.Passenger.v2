import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { getAvatar, getOrdersHistory, getOrUpdateZone, getProfileInfo } from './thunks';
import { type Profile, ZoneFromAPI } from './types';
import { PassengerState } from './types';

const initialState: PassengerState = {
  profile: null,
  zone: null,
  ordersHistory: [],
  isOrdersHistoryOffsetEmpty: false,
  ui: {
    isLoadingStubVisible: true,
    activeBottomWindowYCoordinate: 0,
  },
  loading: {
    passengerAvatar: false,
    passengerInfo: false,
    ordersHistory: false,
    general: false,
  },
  error: {
    general: null,
    passengerAvatar: null,
    passengerInfo: null,
    ordersHistory: null,
  },
};

const slice = createSlice({
  name: 'passenger',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
    setIsLoadingStubVisible(state, action: PayloadAction<boolean>) {
      state.ui.isLoadingStubVisible = action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<Profile>>) {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
    },
    setZone(state, action: PayloadAction<ZoneFromAPI | null>) {
      state.zone = action.payload;
    },
    clearOrdersHistory(state) {
      state.ordersHistory = initialState.ordersHistory;
      state.isOrdersHistoryOffsetEmpty = initialState.isOrdersHistoryOffsetEmpty;
    },
    clearPassengerInfo(state) {
      state.profile = null;
      state.zone = null;
    },
    setActiveBottomWindowYCoordinate(
      state,
      action: PayloadAction<PassengerState['ui']['activeBottomWindowYCoordinate']>,
    ) {
      state.ui.activeBottomWindowYCoordinate = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getOrUpdateZone.pending, state => {
        state.loading.general = true;
        state.error.general = null;
      })
      .addCase(getOrUpdateZone.fulfilled, (state, action) => {
        slice.caseReducers.setZone(state, {
          payload: action.payload,
          type: setZone.type,
        });
      })
      .addCase(getOrUpdateZone.rejected, (state, action) => {
        state.loading.general = true;
        state.error.general = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getOrdersHistory.pending, state => {
        state.loading.ordersHistory = true;
        state.error.ordersHistory = null;
      })
      .addCase(getOrdersHistory.fulfilled, (state, action) => {
        if (action.payload.length) {
          state.ordersHistory.push(...action.payload);
        } else {
          state.isOrdersHistoryOffsetEmpty = true;
        }

        state.loading.ordersHistory = false;
        state.error.ordersHistory = null;
      })
      .addCase(getOrdersHistory.rejected, (state, action) => {
        state.loading.ordersHistory = false;
        state.error.ordersHistory = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getAvatar.pending, state => {
        state.loading.passengerAvatar = true;
        state.error.passengerAvatar = null;
      })
      .addCase(getAvatar.fulfilled, state => {
        state.loading.passengerAvatar = false;
        state.error.passengerAvatar = null;
      })
      .addCase(getAvatar.rejected, (state, action) => {
        state.loading.passengerAvatar = true;
        state.error.passengerAvatar = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getProfileInfo.pending, state => {
        state.loading.passengerInfo = false;
        state.error.passengerInfo = null;
      })
      .addCase(getProfileInfo.fulfilled, (state, action) => {
        state.profile = action.payload;

        state.loading.passengerInfo = false;
        state.error.passengerInfo = null;
      })
      .addCase(getProfileInfo.rejected, (state, action) => {
        state.loading.passengerInfo = false;
        state.error.passengerInfo = action.payload as NetworkErrorDetailsWithBody<any>;
      });
  },
});

export const {
  clearOrdersHistory,
  clearPassengerInfo,
  setProfile,
  updateProfile,
  setZone,
  setIsLoadingStubVisible,
  setActiveBottomWindowYCoordinate,
} = slice.actions;

export default slice.reducer;
