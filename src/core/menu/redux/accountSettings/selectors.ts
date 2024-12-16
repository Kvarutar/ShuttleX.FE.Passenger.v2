import { AppState } from '../../../redux/store';

export const isAccountSettingsLoadingSelector = (state: AppState) => state.accountSettings.isLoading;
export const accountSettingsErrorSelector = (state: AppState) => state.accountSettings.error;
export const accountSettingsVerifyStatusSelector = (state: AppState) => state.accountSettings.verifyStatus;
export const isAccountSettingsEmailVerifiedSelector = (state: AppState) =>
  state.accountSettings.verifyStatus?.isEmailVerified;
export const isAccountSettingsPhoneVerifiedSelector = (state: AppState) =>
  state.accountSettings.verifyStatus?.isPhoneVerified;
