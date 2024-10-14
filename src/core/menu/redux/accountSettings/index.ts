import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVerificationDone: false,
};

const slice = createSlice({
  name: 'accountSettings',
  initialState,
  reducers: {
    setIsVerificationDone(state, action) {
      state.isVerificationDone = action.payload;
    },
    resetVerification(state) {
      state.isVerificationDone = false;
    },
  },
});

export const { setIsVerificationDone, resetVerification } = slice.actions;
export default slice.reducer;
