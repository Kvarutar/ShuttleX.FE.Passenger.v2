import authInstanceInitializer from './authClient';
import authResetInstanceInitializer from './authResetClient';
import geomappingInstanceInitializer from './geomappingClient';
import notificatorInstanceInitializer from './notificatorClient';
import orderInstanceInitializer from './orderClient';
import passengerInstanceInitializer from './passengerClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  authResetAxios: authResetInstanceInitializer,
  passengerAxios: passengerInstanceInitializer,
  geomappingAxios: geomappingInstanceInitializer,
  notificatorAxios: notificatorInstanceInitializer,
  orderAxios: orderInstanceInitializer,
};

export default axiosInitilizers;
