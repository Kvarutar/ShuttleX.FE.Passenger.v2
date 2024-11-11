import authInstanceInitializer from './authClient';
import passengerInstanceInitializer from './passengerClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  passengerAxios: passengerInstanceInitializer,
};

export default axiosInitilizers;
