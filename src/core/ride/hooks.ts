import { useState } from 'react';
import {
  useGeolocationStartWatch as useGeolocationStartWatchIntegration,
  useNetworkConnectionStartWatch as useNetworkConnectionStartWatchIntegration,
} from 'shuttlex-integration';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '../redux/hooks';
import { addAlert, removeAlert } from './redux/alerts';
import { AlertPriority } from './redux/alerts/types';
import {
  setGeolocationAccuracy,
  setGeolocationCoordinates,
  setGeolocationError,
  setGeolocationIsLocationEnabled,
  setGeolocationIsPermissionGranted,
} from './redux/geolocation';

export const useGeolocationStartWatch = () => {
  const dispatch = useAppDispatch();

  useGeolocationStartWatchIntegration({
    onLocationEnabledChange: isLocationEnabled => dispatch(setGeolocationIsLocationEnabled(isLocationEnabled)),
    onPermissionGrantedChange: isPermissionGranted => dispatch(setGeolocationIsPermissionGranted(isPermissionGranted)),
    onAccuracyChange: accuracy => dispatch(setGeolocationAccuracy(accuracy)),
    onCoordinatesChange: coordinates => {
      dispatch(
        setGeolocationCoordinates({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          heading: coordinates.heading ?? 0,
        }),
      );
    },
    onError: error => dispatch(setGeolocationError(error)),
  });
};

export const useNetworkConnectionStartWatch = () => {
  const dispatch = useAppDispatch();

  const [alertId] = useState<string>(uuidv4);

  useNetworkConnectionStartWatchIntegration({
    onConnect() {
      dispatch(removeAlert({ id: alertId }));
    },
    onDisconnect() {
      dispatch(addAlert({ type: 'internet_disconnected', priority: AlertPriority.System, id: alertId }));
    },
  });
};
