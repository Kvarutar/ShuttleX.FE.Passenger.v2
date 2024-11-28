import authInstanceInitializer from './authClient';
import authResetInstanceInitializer from './authResetClient';
import cashieringInstanceInitializer from './casheringClient';
import configInstanceInitializer from './configClient';
import geomappingInstanceInitializer from './geomappingClient';
import lotteryInstanceInitializer from './lotteryClient';
import matchingInstanceInitializer from './matchingClient';
import notificatorInstanceInitializer from './notificatorClient';
import orderInstanceInitializer from './orderClient';
import passengerInstanceInitializer from './passengerClient';
import profileInstanceInitializer from './profileClient';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  authResetAxios: authResetInstanceInitializer,
  cashieringAxios: cashieringInstanceInitializer,
  configAxios: configInstanceInitializer,
  geomappingAxios: geomappingInstanceInitializer,
  lotteryAxios: lotteryInstanceInitializer,
  matchingAxios: matchingInstanceInitializer,
  notificatorAxios: notificatorInstanceInitializer,
  orderAxios: orderInstanceInitializer,
  passengerAxios: passengerInstanceInitializer,
  profileAxios: profileInstanceInitializer,
};

export default axiosInitilizers;
