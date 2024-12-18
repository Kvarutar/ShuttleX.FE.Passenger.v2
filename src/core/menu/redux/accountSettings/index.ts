import { createSlice } from '@reduxjs/toolkit';
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
      state.error.verify = initialState.error.verify;
      state.loading.verify = initialState.loading.verify;
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
        console.error(changeAccountContactData.typePrefix, action.payload);
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
      });
  },
});

export const { setAccountSettingsVerifyStatus, resetAccountSettingsVerification } = slice.actions;
export default slice.reducer;
