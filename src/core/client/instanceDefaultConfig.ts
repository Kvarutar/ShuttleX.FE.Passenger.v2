import { AppState } from 'react-native';
import Config from 'react-native-config';
import { AxiosInstanceConfig, defaultAxiosRetryConfig, InitCreateAppAsyncThunkDispatch } from 'shuttlex-integration';

import { signOut } from '../auth/redux/thunks';
import { AppDispatch } from '../redux/store';

const instanceDefaultConfig = (
  dispatch: InitCreateAppAsyncThunkDispatch<AppState, AppDispatch>,
): AxiosInstanceConfig => {
  return {
    retryConfig: defaultAxiosRetryConfig,
    onSignOut: () => dispatch(signOut()),
    refreshTokenUrl: `${Config.API_AUTH_URL_HTTPS}/refresh`,
  };
};

export default instanceDefaultConfig;
