import { combineReducers, configureStore } from '@reduxjs/toolkit';

import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';
import passengerReducer from './passenger';

const rootReducer = combineReducers({
  alerts: alertsReducer,
  geolocation: geolocationReducer,
  passenger: passengerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
