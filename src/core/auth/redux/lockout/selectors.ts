import { AppState } from '../../../redux/store';

export const selectLockoutEndTimestamp = (state: AppState) => state.lockout.lockoutEndTimestamp;
export const selectLockoutAttempts = (state: AppState) => state.lockout.lockoutAttempts;
