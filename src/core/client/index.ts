import authAccountSettingsInstanceInitializer from './authAccountSettingsClient';
import authInstanceInitializer from './authClient';
import cashieringInstanceInitializer from './casheringClient';
import chatInstanceInitializer from './chatClient.ts';
import configInstanceInitializer from './configClient';
import passengerLongPollingInstanceInitializer from './longPollingClient';
import lotteryInstanceInitializer from './lotteryClient';
import matchingInstanceInitializer from './matchingClient';
import notificatorInstanceInitializer from './notificatorClient';
import orderInstanceInitializer from './orderClient';
import passengerInstanceInitializer from './passengerClient';
import profileInstanceInitializer from './profileClient';
import streamingInstanceInitializer from './streamingClient.ts';

const axiosInitilizers = {
  authAxios: authInstanceInitializer,
  authAccountSettingsAxios: authAccountSettingsInstanceInitializer,
  cashieringAxios: cashieringInstanceInitializer,
  configAxios: configInstanceInitializer,
  lotteryAxios: lotteryInstanceInitializer,
  streamingAxios: streamingInstanceInitializer,
  matchingAxios: matchingInstanceInitializer,
  notificatorAxios: notificatorInstanceInitializer,
  orderAxios: orderInstanceInitializer,
  passengerAxios: passengerInstanceInitializer,
  profileAxios: profileInstanceInitializer,
  passengerLongPollingAxios: passengerLongPollingInstanceInitializer,
  chatAxios: chatInstanceInitializer,
};

export default axiosInitilizers;
