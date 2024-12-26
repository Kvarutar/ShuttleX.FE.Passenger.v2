import { combineReducers, configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';

import reactotron from '../../../ReactotronConfig';
import authReducer from '../auth/redux';
import lotteryReducer from '../lottery/redux';
import accountSettingsReducer from '../menu/redux/accountSettings';
import notificationsReducer from '../menu/redux/notifications';
import walletRedicer from '../menu/redux/wallet';
import passengerReducer from '../passenger/redux';
import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import mapReducer from '../ride/redux/map';
import offerReducer from '../ride/redux/offer';
import orderReducer from '../ride/redux/order';
import tripReducer from '../ride/redux/trip';
import signalRReducer from './signalr';

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationsReducer,
  wallet: walletRedicer,
  alerts: alertsReducer,
  geolocation: geolocationReducer,
  map: mapReducer,
  order: orderReducer,
  offer: offerReducer,
  trip: tripReducer,
  passenger: passengerReducer,
  signalr: signalRReducer,
  accountSettings: accountSettingsReducer,
  lottery: lotteryReducer,
});

const sentryReduxEnhancer = Sentry.createReduxEnhancer();

const devEnhancers = __DEV__ ? [reactotron.createEnhancer!()] : [];

export const store = configureStore({
  reducer: rootReducer,
  enhancers: [...devEnhancers, sentryReduxEnhancer],
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
