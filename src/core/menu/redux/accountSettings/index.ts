import { createSlice } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import {
  changeAccountContactData,
  deleteAccountRequest,
  getAccountSettingsVerifyStatus,
  requestAccountSettingsChangeDataVerificationCode,
  verifyAccountSettingsDataCode,
} from './thunks';
import { AccountSettingsState } from './types';

const initialState: AccountSettingsState = {
  verifyStatus: {
    phone: '',
    isPhoneVerified: false,
    email: '',
    isEmailVerified: false,
  },
  loading: {
    changeData: false,
    verify: false,
    requestCode: false,
    getVerifyStatus: false,
  },
  error: {
    changeData: null,
    verify: null,
    requestCode: null,
    getVerifyStatus: null,
    deleteAccount: null,
  },
};

const slice = createSlice({
  name: 'accountSettings',
  initialState,
  reducers: {
    setAccountSettingsVerifyStatus(state, action) {
      state.verifyStatus = action.payload;
    },
    resetAccountSettingsVerification(state) {
      state.error.changeData = initialState.error.changeData;
      state.loading.changeData = initialState.loading.changeData;
      state.error.verify = initialState.error.verify;
      state.loading.verify = initialState.loading.verify;
      state.error.deleteAccount = initialState.error.deleteAccount;
    },
  },
  extraReducers: builder => {
    builder
      //ChangeData
      .addCase(changeAccountContactData.pending, state => {
        state.loading.changeData = true;
        state.loading.verify = true;
        state.error.changeData = null;
      })
      .addCase(changeAccountContactData.fulfilled, state => {
        state.loading.changeData = false;
        state.error.changeData = null;
      })
      .addCase(changeAccountContactData.rejected, (state, action) => {
        state.loading.changeData = false;
        state.error.changeData = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      //VerifyData
      .addCase(verifyAccountSettingsDataCode.pending, state => {
        state.loading.verify = true;
        state.error.verify = null;
      })
      .addCase(verifyAccountSettingsDataCode.fulfilled, state => {
        state.loading.verify = false;
        state.error.verify = null;
      })
      .addCase(verifyAccountSettingsDataCode.rejected, (state, action) => {
        state.loading.verify = false;
        state.error.verify = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      //RequestCode
      .addCase(requestAccountSettingsChangeDataVerificationCode.pending, state => {
        state.loading.requestCode = true;
        state.loading.verify = true;
        state.error.requestCode = null;
      })
      .addCase(requestAccountSettingsChangeDataVerificationCode.fulfilled, state => {
        state.loading.requestCode = false;
        state.error.requestCode = null;
      })
      .addCase(requestAccountSettingsChangeDataVerificationCode.rejected, (state, action) => {
        state.loading.requestCode = false;
        state.error.requestCode = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      //VerifyStatus
      .addCase(getAccountSettingsVerifyStatus.pending, state => {
        state.loading.getVerifyStatus = true;
        state.error.getVerifyStatus = null;
      })
      .addCase(getAccountSettingsVerifyStatus.fulfilled, (state, action) => {
        state.loading.getVerifyStatus = false;
        state.error.getVerifyStatus = null;
        state.verifyStatus = action.payload;
      })
      .addCase(getAccountSettingsVerifyStatus.rejected, (state, action) => {
        state.loading.getVerifyStatus = false;
        state.error.getVerifyStatus = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      //Delete Account
      .addCase(deleteAccountRequest.pending, state => {
        state.error.deleteAccount = null;
      })
      .addCase(deleteAccountRequest.fulfilled, state => {
        state.error.deleteAccount = null;
      })
      .addCase(deleteAccountRequest.rejected, (state, action) => {
        state.error.deleteAccount = action.payload as NetworkErrorDetailsWithBody<any>;
      });
  },
});

export const { setAccountSettingsVerifyStatus, resetAccountSettingsVerification } = slice.actions;
export default slice.reducer;
