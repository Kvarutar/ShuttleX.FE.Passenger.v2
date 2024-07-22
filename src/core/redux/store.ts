import { combineReducers, configureStore } from '@reduxjs/toolkit';

import reactotron from '../../../ReactotronConfig';
import notificationsReducer from '../menu/redux/notifications';
import walletRedicer from '../menu/redux/wallet';
import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import mapReducer from '../ride/redux/map';
import orderReducer from '../ride/redux/order';
import tripReducer from '../ride/redux/trip';
import passengerReducer from './passenger';
import signalRReducer from './signalr';
import { signalRMiddleware } from './signalr/middleware';

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  wallet: walletRedicer,
  alerts: alertsReducer,
  geolocation: geolocationReducer,
  map: mapReducer,
  order: orderReducer,
  trip: tripReducer,
  passenger: passengerReducer,
  signalR: signalRReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(signalRMiddleware()),
  enhancers: __DEV__ ? [reactotron.createEnhancer!()] : [],
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
