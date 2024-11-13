import authInstanceInitializer from './authClient';
import geomappingInstanceInitializer from './geomappingClient';
import passengerInstanceInitializer from './passengerClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  passengerAxios: passengerInstanceInitializer,
  geomappingAxios: geomappingInstanceInitializer,
};

export default axiosInitilizers;
