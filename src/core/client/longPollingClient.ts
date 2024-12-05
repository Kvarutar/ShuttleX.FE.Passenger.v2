import { AxiosInstance } from 'axios';
import { AppState } from 'react-native';
import { Config } from 'react-native-config';
import { createAxiosInstance, InitCreateAppAsyncThunkDispatch } from 'shuttlex-integration';

import { AppDispatch } from '../redux/store';
import instanceLongPollingConfig from './longPollingInstanceConfig';

const passengerLongPollingInstanceInitializer = (
  dispatch: InitCreateAppAsyncThunkDispatch<AppState, AppDispatch>,
): AxiosInstance => {
  return createAxiosInstance({
    url: `${Config.API_PASSENGER_URL_HTTPS}`,
    ...instanceLongPollingConfig(dispatch),
  });
};

export default passengerLongPollingInstanceInitializer;
