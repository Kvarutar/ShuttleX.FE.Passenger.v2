import { Middleware } from '@reduxjs/toolkit';
import Config from 'react-native-config';
import { LatLng } from 'react-native-maps';
import { SignalR } from 'shuttlex-integration';

import { type AppDispatch, type AppState } from '../store';
import { connectSignalR, getContractorsCars, updateSignalRAccessToken } from '.';

export const signalRMiddleware = (): Middleware => {
  const signalR = new SignalR<AppState, AppDispatch>(
    Config.SIGNALR_URL,
    connectSignalR.type,
    updateSignalRAccessToken.type,
  );

  signalR.listen('OnContractorGeoReceived', ({ store }, latlng: LatLng) => {
    store.signalR.contractorCoordinates = latlng;
  });

  signalR.listen('OnOrderCanceled', (_, orderId: string) => {
    console.log('OnOrderCanceled:', orderId);
  });

  signalR.on(getContractorsCars.type, 'GetContractorsInRadius', ({ store }, res) => {
    store.signalR.contractorsCars = res;
  });

  return api => next => action => signalR.process(api, next, action);
};
