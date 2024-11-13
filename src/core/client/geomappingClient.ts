import { AxiosInstance } from 'axios';
import { Config } from 'react-native-config';
import { createAxiosInstance, InitCreateAppAsyncThunkDispatch } from 'shuttlex-integration';

import { AppDispatch, AppState } from '../redux/store';
import instanceDefaultConfig from './instanceDefaultConfig';

const geomappingInstanceInitializer = (
  dispatch: InitCreateAppAsyncThunkDispatch<AppState, AppDispatch>,
): AxiosInstance => {
  return createAxiosInstance({
    url: `${Config.API_GEOMAPPING_URL_HTTPS}`,
    ...instanceDefaultConfig(dispatch),
    retryConfig: undefined,
  });
};

export default geomappingInstanceInitializer;
