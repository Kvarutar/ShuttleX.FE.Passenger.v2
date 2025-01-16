import Config from 'react-native-config';
import EventSource from 'react-native-sse';
import { Nullable } from 'shuttlex-integration';

import { SSEAndNotificationsEventType } from '../utils/notifications/types';
import {
  driverAcceptedSSEHandler,
  driverArrivedSSEHandler,
  driverCanceledSSEHandler,
  driverRejectedSSEHandler,
  tripEndedSSEHandler,
  tripStartedSSEHandler,
} from './handlers';

let eventSource: Nullable<EventSource<SSEAndNotificationsEventType>> = null;

export const initializeSSEConnection = (accessToken: string) => {
  eventSource = new EventSource<SSEAndNotificationsEventType>(`${Config.SSE_URL}/connect?userType=passenger`, {
    method: 'GET',
    headers: {
      Accept: '*/*',
      Connection: 'keep-alive',
      Authorization: `Bearer ${accessToken}`,
    },
    debug: __DEV__,
  });

  eventSource.addEventListener(SSEAndNotificationsEventType.DriverAccepted, driverAcceptedSSEHandler);
  eventSource.addEventListener(SSEAndNotificationsEventType.DriverArrived, driverArrivedSSEHandler);
  eventSource.addEventListener(SSEAndNotificationsEventType.TripStarted, tripStartedSSEHandler);
  eventSource.addEventListener(SSEAndNotificationsEventType.TripEnded, tripEndedSSEHandler);
  eventSource.addEventListener(SSEAndNotificationsEventType.DriverCanceled, driverCanceledSSEHandler);
  eventSource.addEventListener(SSEAndNotificationsEventType.DriverRejected, driverRejectedSSEHandler);
};

export const removeAllSSEListeners = () => {
  if (eventSource) {
    eventSource.removeAllEventListeners();
  }
};

export const closeSSEConnection = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
};
