import { combineReducers, configureStore } from '@reduxjs/toolkit';

import notificationsReducer from '../menu/redux/notifications';
import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import offerReducer from '../ride/redux/offer';
import tripReducer from '../ride/redux/trip';
import passengerReducer from './passenger';

const rootReducer = combineReducers({
  alerts: alertsReducer,
  notifications: notificationsReducer,
  geolocation: geolocationReducer,
  offer: offerReducer,
  trip: tripReducer,
  passenger: passengerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
