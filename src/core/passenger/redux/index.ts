import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getOrUpdateZone, getProfileInfo } from './thunks';
import { type Profile, ZoneFromAPI } from './types';
import { PassengerState } from './types';

const initialState: PassengerState = {
  profile: null,
  zone: null,
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
  },
  extraReducers: builder => {
    builder
      .addCase(getOrUpdateZone.fulfilled, (state, action) => {
        slice.caseReducers.setZone(state, {
          payload: action.payload,
          type: setZone.type,
        });
      })
      .addCase(getProfileInfo.fulfilled, (state, action) => {
        slice.caseReducers.setProfile(state, {
          payload: action.payload,
          type: setProfile.type,
        });
      });
  },
});

export const { setProfile, updateProfile, setZone } = slice.actions;

export default slice.reducer;
