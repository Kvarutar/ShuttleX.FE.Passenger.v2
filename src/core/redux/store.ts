import { combineReducers, configureStore } from '@reduxjs/toolkit';

import alertsReducer from '../ride/redux/alerts';

const rootReducer = combineReducers({
  alerts: alertsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
