import { AppState } from '../../../redux/store';

export const isAccountSettingsVerificationDoneSelector = (state: AppState) => state.accountSettings.isVerificationDone;
export const isAccountSettingsLoadingSelector = (state: AppState) => state.accountSettings.isLoading;
export const accountSettingsErrorSelector = (state: AppState) => state.accountSettings.error;
