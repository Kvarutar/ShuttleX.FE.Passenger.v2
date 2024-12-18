import { AppState } from '../../../redux/store';

export const accountSettingsVerifyStatusSelector = (state: AppState) => state.accountSettings.verifyStatus;
export const isAccountSettingsEmailVerifiedSelector = (state: AppState) =>
  state.accountSettings.verifyStatus?.isEmailVerified;
export const isAccountSettingsPhoneVerifiedSelector = (state: AppState) =>
  state.accountSettings.verifyStatus?.isPhoneVerified;
export const isAccountSettingsChangeDataLoadingSelector = (state: AppState) => state.accountSettings.loading.changeData;
export const isAccountSettingsVerifyLoadingSelector = (state: AppState) => state.accountSettings.loading.verify;
export const accountSettingsChangeDataErrorSelector = (state: AppState) => state.accountSettings.error.changeData;
