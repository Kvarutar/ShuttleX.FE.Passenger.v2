import { useEffect } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import { checkLocationAccuracy } from 'react-native-permissions';

import { useAppDispatch } from '../redux/hooks';
import { checkGeolocationPermission, requestGeolocationPermission } from '../utils/permissions';
import {
  setGeolocationAccuracyOnlyIOS,
  setGeolocationCoordinates,
  setGeolocationError,
  setGeolocationIsLocationEnabled,
  setGeolocationIsPermissionGranted,
} from './redux/geolocation';

const geolocationConsts = {
  checkInterval: 6000,
  updatePositionInterval: 500,
};

export const useGeolocationStartWatch = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const isPermissonGranted = await requestGeolocationPermission();
      if (isPermissonGranted) {
        dispatch(setGeolocationIsPermissionGranted(true));

        setInterval(async () => {
          const [isLocationEnabled, isPermissonStillGranted] = await Promise.all([
            DeviceInfo.isLocationEnabled(),
            checkGeolocationPermission(),
          ]);

          dispatch(setGeolocationIsLocationEnabled(isLocationEnabled));

          if (!isPermissonStillGranted) {
            dispatch(setGeolocationIsPermissionGranted(false));
          }

          if (Platform.OS === 'ios') {
            const accuracy = await checkLocationAccuracy();
            dispatch(setGeolocationAccuracyOnlyIOS(accuracy));
          }
        }, geolocationConsts.checkInterval);

        Geolocation.watchPosition(
          position => dispatch(setGeolocationCoordinates(position.coords)),
          error => dispatch(setGeolocationError(error)),
          { enableHighAccuracy: true, interval: geolocationConsts.updatePositionInterval },
        );
      } else {
        dispatch(setGeolocationIsPermissionGranted(false));
      }
    })();
  }, [dispatch]);
};
