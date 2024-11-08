import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { signIn, signUp, verifyCode } from './thunks';
import { AuthState } from './types';

const initialState: AuthState = {
  isLoading: false,
  error: null,
  isLoggedIn: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsSignDataSend(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSignError(state, action: PayloadAction<NetworkErrorDetailsWithBody<any> | null>) {
      state.error = action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signIn.pending, state => {
        slice.caseReducers.setIsSignDataSend(state, {
          payload: true,
          type: setIsSignDataSend.type,
        });
        slice.caseReducers.setSignError(state, {
          payload: initialState.error,
          type: setSignError.type,
        });
      })
      .addCase(signIn.fulfilled, state => {
        slice.caseReducers.setIsSignDataSend(state, {
          payload: false,
          type: setIsSignDataSend.type,
        });
        slice.caseReducers.setSignError(state, {
          payload: initialState.error,
          type: setSignError.type,
        });
      })
      .addCase(signIn.rejected, (state, action) => {
        slice.caseReducers.setIsSignDataSend(state, {
          payload: false,
          type: setIsSignDataSend.type,
        });
        slice.caseReducers.setSignError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setSignError.type,
        });
      })
      .addCase(signUp.pending, state => {
        slice.caseReducers.setIsSignDataSend(state, {
          payload: true,
          type: setIsSignDataSend.type,
        });
        slice.caseReducers.setSignError(state, {
          payload: initialState.error,
          type: setSignError.type,
        });
      })
      .addCase(signUp.fulfilled, state => {
        slice.caseReducers.setIsSignDataSend(state, {
          payload: false,
          type: setIsSignDataSend.type,
        });
        slice.caseReducers.setSignError(state, {
          payload: initialState.error,
          type: setSignError.type,
        });
      })
      .addCase(signUp.rejected, (state, action) => {
        slice.caseReducers.setIsSignDataSend(state, {
          payload: false,
          type: setIsSignDataSend.type,
        });
        slice.caseReducers.setSignError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setSignError.type,
        });
      })

      .addCase(verifyCode.pending, state => {
        slice.caseReducers.setIsSignDataSend(state, {
          payload: true,
          type: setIsSignDataSend.type,
        });
        slice.caseReducers.setSignError(state, {
          payload: initialState.error,
          type: setSignError.type,
        });
      })
      .addCase(verifyCode.fulfilled, state => {
        slice.caseReducers.setIsSignDataSend(state, {
          payload: false,
          type: setIsSignDataSend.type,
        });
        slice.caseReducers.setSignError(state, {
          payload: initialState.error,
          type: setSignError.type,
        });
        slice.caseReducers.setIsLoggedIn(state, {
          payload: true,
          type: setSignError.type,
        });
      })
      .addCase(verifyCode.rejected, (state, action) => {
        slice.caseReducers.setIsSignDataSend(state, {
          payload: false,
          type: setIsSignDataSend.type,
        });
        slice.caseReducers.setSignError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setSignError.type,
        });
      });
  },
});

export const { setIsSignDataSend, setSignError, setIsLoggedIn } = slice.actions;

export default slice.reducer;
