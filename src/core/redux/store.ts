import { combineReducers, configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import reactotron from '../../../ReactotronConfig';
import authReducer from '../auth/redux';
import { MMKVStorage } from '../localStorage';
import lotteryReducer from '../lottery/redux';
import accountSettingsReducer from '../menu/redux/accountSettings';
import walletRedicer from '../menu/redux/wallet';
import passengerReducer from '../passenger/redux';
import alertsReducer from '../ride/redux/alerts';
import chatReducer from '../ride/redux/chat';
import geolocationReducer from '../ride/redux/geolocation';
import mapReducer from '../ride/redux/map';
import offerReducer from '../ride/redux/offer';
import orderReducer from '../ride/redux/order';
import streamingReducer from '../ride/redux/streaming';
import tripReducer from '../ride/redux/trip';
import signalRReducer from './signalr';

//Add some different configs when work with data persisting
const offerPersistConfig = {
  key: 'offer',
  storage: MMKVStorage,
  whitelist: [], //TODO: Add 'points' in the 'persisting points' task
};

//Change some reducers like 'offer' when work with data persisting
const rootReducer = combineReducers({
  auth: authReducer,
  wallet: walletRedicer,
  alerts: alertsReducer,
  geolocation: geolocationReducer,
  map: mapReducer,
  order: orderReducer,
  offer: persistReducer<ReturnType<typeof offerReducer>>(offerPersistConfig, offerReducer),
  trip: tripReducer,
  passenger: passengerReducer,
  signalr: signalRReducer,
  accountSettings: accountSettingsReducer,
  lottery: lotteryReducer,
  streaming: streamingReducer,
  chat: chatReducer,
});

const sentryReduxEnhancer = Sentry.createReduxEnhancer();

const devEnhancers = __DEV__ ? [reactotron.createEnhancer!()] : [];

export const store = configureStore({
  reducer: rootReducer,
  enhancers: [...devEnhancers, sentryReduxEnhancer],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
