import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import {
  changeAccountContactData,
  getAccountSettingsVerifyStatus,
  requestAccountSettingsChangeDataVerificationCode,
  verifyAccountSettingsDataCode,
} from './thunks';
import { AccountSettingsState } from './types';

const initialState: AccountSettingsState = {
  verifyStatus: {
    phoneInfo: '',
    isPhoneVerified: false,
    emailInfo: '',
    isEmailVerified: false,
  },
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'accountSettings',
  initialState,
  reducers: {
    setAccountSettingsVerifyStatus(state, action) {
      state.verifyStatus = action.payload;
    },
    setAccountSettingsIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAccountSettingsError(state, action: PayloadAction<AccountSettingsState['error']>) {
      state.error = action.payload;
    },
    resetAccountSettingsVerification(state) {
      state.error = initialState.error;
      state.isLoading = initialState.isLoading;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(changeAccountContactData.pending, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: true,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(changeAccountContactData.fulfilled, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(changeAccountContactData.rejected, (state, action) => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setAccountSettingsError.type,
        });
        console.error(changeAccountContactData.typePrefix, action.payload);
      })
      .addCase(verifyAccountSettingsDataCode.pending, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: true,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(verifyAccountSettingsDataCode.fulfilled, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(verifyAccountSettingsDataCode.rejected, (state, action) => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setAccountSettingsError.type,
        });
      })
      .addCase(requestAccountSettingsChangeDataVerificationCode.pending, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: true,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(requestAccountSettingsChangeDataVerificationCode.fulfilled, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(requestAccountSettingsChangeDataVerificationCode.rejected, (state, action) => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setAccountSettingsError.type,
        });
      })

      .addCase(getAccountSettingsVerifyStatus.pending, state => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: true,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
      })
      .addCase(getAccountSettingsVerifyStatus.fulfilled, (state, action) => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: initialState.error,
          type: setAccountSettingsError.type,
        });
        slice.caseReducers.setAccountSettingsVerifyStatus(state, {
          payload: action.payload,
          type: setAccountSettingsVerifyStatus.type,
        });
      })
      .addCase(getAccountSettingsVerifyStatus.rejected, (state, action) => {
        slice.caseReducers.setAccountSettingsIsLoading(state, {
          payload: false,
          type: setAccountSettingsIsLoading.type,
        });
        slice.caseReducers.setAccountSettingsError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setAccountSettingsError.type,
        });
      });
  },
});

export const {
  setAccountSettingsIsLoading,
  setAccountSettingsVerifyStatus,
  resetAccountSettingsVerification,
  setAccountSettingsError,
} = slice.actions;
export default slice.reducer;
