import authInstanceInitializer from './authClient';
import authResetInstanceInitializer from './authResetClient';
import geomappingInstanceInitializer from './geomappingClient';
import lotteryInstanceInitializer from './lotteryClient';
import notificatorInstanceInitializer from './notificatorClient';
import orderInstanceInitializer from './orderClient';
import passengerInstanceInitializer from './passengerClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  authResetAxios: authResetInstanceInitializer,
  passengerAxios: passengerInstanceInitializer,
  geomappingAxios: geomappingInstanceInitializer,
  notificatorAxios: notificatorInstanceInitializer,
  lotteryAxios: lotteryInstanceInitializer,
  orderAxios: orderInstanceInitializer,
};

export default axiosInitilizers;
