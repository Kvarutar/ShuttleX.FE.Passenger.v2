import { Config } from 'react-native-config';
import { createAxiosInstance, defaultAxiosRetryConfig } from 'shuttlex-integration';

const shuttlexPassengerInstance = createAxiosInstance({
  url: `${Config.API_URL_HTTPS}`,
  retryConfig: defaultAxiosRetryConfig,
});

export default shuttlexPassengerInstance;
