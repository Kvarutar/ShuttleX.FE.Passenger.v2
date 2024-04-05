import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PassengerState, Profile } from './types';

const initialState: PassengerState = {
  profile: null,
};

const slice = createSlice({
  name: 'passenger',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = slice.actions;

export default slice.reducer;
