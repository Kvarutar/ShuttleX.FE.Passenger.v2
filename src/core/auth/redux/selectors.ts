import { AppState } from '../../redux/store';

export const isAuthLoadingSelector = (state: AppState) => state.auth.isLoading;
export const authErrorSelector = (state: AppState) => state.auth.error;
export const isLoggedInSelector = (state: AppState) => state.auth.isLoggedIn;
