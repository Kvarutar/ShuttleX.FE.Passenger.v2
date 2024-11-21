import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { type Profile } from './types';
import { PassengerState } from './types';

const initialState: PassengerState = {
  profile: {
    fullName: 'Test',
    email: 'mail@mail.ua',
    phone: '+380509245061',
    imageUri: '',
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
  },
});

export const { setProfile, updateProfile } = slice.actions;

export default slice.reducer;
