import { AppState } from '../../../redux/store';

export const isVerificationDoneSelector = (state: AppState) => state.settingsVerification.isVerificationDone;
