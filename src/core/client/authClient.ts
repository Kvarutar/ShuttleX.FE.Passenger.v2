import { AxiosInstance } from 'axios';
import { Config } from 'react-native-config';
import { createAxiosInstance } from 'shuttlex-integration';

const authInstanceInitializer = (): AxiosInstance => {
  return createAxiosInstance({
    url: `${Config.API_AUTH_URL_HTTPS}`,
    withAuth: false,
  });
};

export default authInstanceInitializer;
