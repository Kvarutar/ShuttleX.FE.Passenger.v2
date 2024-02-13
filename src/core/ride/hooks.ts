import { useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';

import { useAppDispatch } from '../redux/hooks';
import { checkGeolocationPermissionAndAccuracy, requestGeolocationPermission } from '../utils/permissions';
import {
  setGeolocationAccuracy,
  setGeolocationCoordinates,
  setGeolocationError,
  setGeolocationIsLocationEnabled,
  setGeolocationIsPermissionGranted,
} from './redux/geolocation';

const geolocationConsts = {
  checkInterval: 5000,
};

export const useGeolocationStartWatch = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let watchId: number | null = null;

    const clearWatch = () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        watchId = null;
      }
    };

    const startWatch = async () => {
      const isLocationEnabled = await DeviceInfo.isLocationEnabled();
      dispatch(setGeolocationIsLocationEnabled(isLocationEnabled));

      let permissionAndAccuracy: Awaited<ReturnType<typeof checkGeolocationPermissionAndAccuracy>> | null = null;
      if (isLocationEnabled) {
        permissionAndAccuracy = await checkGeolocationPermissionAndAccuracy();
        dispatch(setGeolocationIsPermissionGranted(permissionAndAccuracy.isGranted));
        dispatch(setGeolocationAccuracy(permissionAndAccuracy.accuracy));
      }

      if (
        isLocationEnabled &&
        permissionAndAccuracy &&
        permissionAndAccuracy.isGranted &&
        permissionAndAccuracy.accuracy === 'full'
      ) {
        if (watchId === null) {
          watchId = Geolocation.watchPosition(
            position => dispatch(setGeolocationCoordinates(position.coords)),
            error => dispatch(setGeolocationError(error)),
            { accuracy: { android: 'high', ios: 'best' }, distanceFilter: 2 },
          );
        }
      } else {
        clearWatch();
      }
    };

    (async () => {
      await requestGeolocationPermission();
      await startWatch();

      setInterval(async () => {
        startWatch();
      }, geolocationConsts.checkInterval);
    })();

    return () => {
      clearWatch();
    };
  }, [dispatch]);
};
