import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getTokens, useTheme } from 'shuttlex-integration';

import { setIsLoggedIn } from '../core/auth/redux';
import { isLoggedInSelector } from '../core/auth/redux/selectors';
import { getAllCurrentTickets } from '../core/lottery/redux/thunks';
import { passengerZoneSelector } from '../core/passenger/redux/selectors';
import { getOrUpdateZone, getProfileInfo, updateProfileLanguage } from '../core/passenger/redux/thunks';
import { useAppDispatch } from '../core/redux/hooks';
import { signalRThunks, updateSignalRAccessToken } from '../core/redux/signalr';
import { geolocationCoordinatesSelector } from '../core/ride/redux/geolocation/selectors';
import { getAvaliableTariffs, getRecentDropoffs } from '../core/ride/redux/offer/thunks';
import { getFirebaseDeviceToken, setupNotifications } from '../core/utils/notifications/notificationSetup';
import { InitialSetupProps } from './types';

const InitialSetup = ({ children }: InitialSetupProps) => {
  const { setThemeMode } = useTheme();
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  const isLoggedIn = useSelector(isLoggedInSelector);
  const defaultLocation = useSelector(geolocationCoordinatesSelector);
  const passengerZone = useSelector(passengerZoneSelector);

  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    setThemeMode('light');
  }, [setThemeMode]);

  useEffect(() => {
    (async () => {
      const { accessToken } = await getTokens();

      if (accessToken) {
        getFirebaseDeviceToken();

        dispatch(getRecentDropoffs({ amount: 10 }));
        dispatch(getProfileInfo());
        console.log('accessToken', accessToken);
        dispatch(getAllCurrentTickets());
        dispatch(setIsLoggedIn(true));

        dispatch(getOrUpdateZone());
      } else {
        dispatch(setIsLoggedIn(false));
      }
    })();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (locationLoaded) {
      dispatch(getOrUpdateZone());
      dispatch(getAvaliableTariffs());
      dispatch(getRecentDropoffs({ amount: 10 }));
    }
  }, [locationLoaded, dispatch]);

  useEffect(() => {
    if (defaultLocation && !locationLoaded) {
      setLocationLoaded(true);
    }
  }, [defaultLocation, locationLoaded]);

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        const { accessToken } = await getTokens();
        if (accessToken) {
          console.log('accessToken', accessToken);

          dispatch(updateSignalRAccessToken(accessToken));
          dispatch(signalRThunks.connect());
        }
      })();
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    dispatch(updateProfileLanguage(i18n.language));
  }, [passengerZone, i18n.language, dispatch]);

  useEffect(() => {
    dispatch(getAvaliableTariffs());
  }, [passengerZone, dispatch]);

  useEffect(() => {
    setupNotifications();
  }, [dispatch]);

  return children;
};

export default InitialSetup;
