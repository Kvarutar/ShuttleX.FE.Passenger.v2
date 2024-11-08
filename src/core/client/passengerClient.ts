import { AxiosInstance } from 'axios';
import { AppState } from 'react-native';
import { Config } from 'react-native-config';
import { createAxiosInstance, defaultAxiosRetryConfig, InitCreateAppAsyncThunkDispatch } from 'shuttlex-integration';

import { signOut } from '../auth/redux/thunks';
import { AppDispatch } from '../redux/store';

const shuttlexPassengerInstanceInitializer = (
  dispatch: InitCreateAppAsyncThunkDispatch<AppState, AppDispatch>,
): AxiosInstance => {
  return createAxiosInstance({
    url: `${Config.API_URL_HTTPS}`,
    retryConfig: defaultAxiosRetryConfig,
    onSignOut: refreshToken => dispatch(signOut({ refreshToken })),
  });
};

export default shuttlexPassengerInstanceInitializer;
