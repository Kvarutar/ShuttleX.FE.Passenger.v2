import authInstanceInitializer from './authClient';
import geomappingInstanceInitializer from './geomappingClient';
import notificatorInstanceInitializer from './notificatorClient';
import passengerInstanceInitializer from './passengerClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  passengerAxios: passengerInstanceInitializer,
  geomappingAxios: geomappingInstanceInitializer,
  notificatorAxios: notificatorInstanceInitializer,
};

export default axiosInitilizers;
