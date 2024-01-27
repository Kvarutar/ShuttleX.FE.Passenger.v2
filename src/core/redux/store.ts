import { combineReducers, configureStore } from '@reduxjs/toolkit';

import alertsReducer from '../ride/redux/alerts';
import geolocationReducer from '../ride/redux/geolocation';

const rootReducer = combineReducers({
  alerts: alertsReducer,
  geolocation: geolocationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
