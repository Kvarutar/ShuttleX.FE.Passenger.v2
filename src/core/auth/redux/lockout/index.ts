import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { minToMilSec } from 'shuttlex-integration';

import { LockoutState } from './types';

const initialState: LockoutState = {
  lockoutEndTimestamp: 0,
  lockoutAttempts: 0,
};

export const calculateLockoutTime = (attempts: number): number => {
  switch (attempts) {
    case 3:
      return minToMilSec(5); // 5 minute block
    case 5:
      return minToMilSec(15); // 15 minute block
    case 10:
      return minToMilSec(1440); // 24 hours block
    case 15:
      return Infinity; // blocked forever
    default:
      return 0; // without block
  }
};

const slice = createSlice({
  name: 'lockout',
  initialState,
  reducers: {
    incrementAttempts: state => {
      state.lockoutAttempts += 1;
      state.lockoutEndTimestamp = calculateLockoutTime(state.lockoutAttempts);
    },

    setLockoutEndTimestamp(state, action: PayloadAction<number>) {
      state.lockoutEndTimestamp = action.payload;
    },
    //TODO: apply when logic for login will be done
    resetLockout: state => {
      state.lockoutEndTimestamp = 0;
      state.lockoutAttempts = 0;
    },
  },
});

export const { incrementAttempts, setLockoutEndTimestamp, resetLockout } = slice.actions;

export default slice.reducer;
