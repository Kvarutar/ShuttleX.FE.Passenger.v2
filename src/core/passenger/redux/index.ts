import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import { getAvatar, getOrUpdateZone, getProfileInfo } from './thunks';
import { type Profile, ZoneFromAPI } from './types';
import { PassengerState } from './types';

const initialState: PassengerState = {
  profile: null,
  zone: null,
  loading: {
    passengerAvatar: false,
    passengerInfo: false,
    general: false,
  },
  error: {
    general: null,
    passengerAvatar: null,
    passengerInfo: null,
  },
};

const slice = createSlice({
  name: 'passenger',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
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
    setIsPassengerGeneralLoading(state, action: PayloadAction<boolean>) {
      state.loading.general = action.payload;
    },
    setIsPassengerAvatarLoading(state, action: PayloadAction<boolean>) {
      state.loading.passengerAvatar = action.payload;
    },
    setIsPassengerInfoLoading(state, action: PayloadAction<boolean>) {
      state.loading.passengerInfo = action.payload;
    },
    setPassengerGeneralError(state, action: PayloadAction<Nullable<NetworkErrorDetailsWithBody<any>>>) {
      state.error.general = action.payload;
    },
    setPassengerAvatarError(state, action: PayloadAction<Nullable<NetworkErrorDetailsWithBody<any>>>) {
      state.error.passengerAvatar = action.payload;
    },
    setPassengerInfoError(state, action: PayloadAction<Nullable<NetworkErrorDetailsWithBody<any>>>) {
      state.error.passengerInfo = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getOrUpdateZone.pending, state => {
        slice.caseReducers.setIsPassengerGeneralLoading(state, {
          payload: true,
          type: setIsPassengerGeneralLoading.type,
        });
        slice.caseReducers.setPassengerGeneralError(state, {
          payload: null,
          type: setPassengerGeneralError.type,
        });
      })
      .addCase(getOrUpdateZone.fulfilled, (state, action) => {
        slice.caseReducers.setZone(state, {
          payload: action.payload,
          type: setZone.type,
        });
      })
      .addCase(getOrUpdateZone.rejected, (state, action) => {
        slice.caseReducers.setIsPassengerGeneralLoading(state, {
          payload: true,
          type: setIsPassengerGeneralLoading.type,
        });
        slice.caseReducers.setPassengerGeneralError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setPassengerGeneralError.type,
        });
      })
      .addCase(getAvatar.pending, state => {
        slice.caseReducers.setIsPassengerAvatarLoading(state, {
          payload: true,
          type: setIsPassengerAvatarLoading.type,
        });
        slice.caseReducers.setPassengerAvatarError(state, {
          payload: null,
          type: setPassengerAvatarError.type,
        });
      })
      .addCase(getAvatar.fulfilled, state => {
        slice.caseReducers.setIsPassengerAvatarLoading(state, {
          payload: false,
          type: setIsPassengerAvatarLoading.type,
        });
        slice.caseReducers.setPassengerAvatarError(state, {
          payload: null,
          type: setPassengerAvatarError.type,
        });
      })
      .addCase(getAvatar.rejected, (state, action) => {
        slice.caseReducers.setIsPassengerAvatarLoading(state, {
          payload: false,
          type: setIsPassengerAvatarLoading.type,
        });
        slice.caseReducers.setPassengerAvatarError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setPassengerAvatarError.type,
        });
      })
      .addCase(getProfileInfo.pending, state => {
        slice.caseReducers.setIsPassengerInfoLoading(state, {
          payload: true,
          type: setIsPassengerInfoLoading.type,
        });
        slice.caseReducers.setPassengerInfoError(state, {
          payload: null,
          type: setPassengerInfoError.type,
        });
      })
      .addCase(getProfileInfo.fulfilled, (state, action) => {
        slice.caseReducers.setProfile(state, {
          payload: action.payload,
          type: setProfile.type,
        });
        slice.caseReducers.setIsPassengerInfoLoading(state, {
          payload: false,
          type: setIsPassengerInfoLoading.type,
        });
        slice.caseReducers.setPassengerInfoError(state, {
          payload: null,
          type: setPassengerInfoError.type,
        });
      })
      .addCase(getProfileInfo.rejected, (state, action) => {
        slice.caseReducers.setIsPassengerInfoLoading(state, {
          payload: false,
          type: setIsPassengerInfoLoading.type,
        });
        slice.caseReducers.setPassengerInfoError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>,
          type: setPassengerInfoError.type,
        });
      });
  },
});

export const {
  setProfile,
  updateProfile,
  setZone,
  setIsPassengerGeneralLoading,
  setIsPassengerAvatarLoading,
  setIsPassengerInfoLoading,
  setPassengerGeneralError,
  setPassengerAvatarError,
  setPassengerInfoError,
} = slice.actions;

export default slice.reducer;
