import { useEffect } from 'react';
import { useTheme } from 'shuttlex-integration';

import { useAppDispatch } from '../core/redux/hooks';
import { signalRThunks, updateSignalRAccessToken } from '../core/redux/signalr';
import { setupNotifications } from '../core/utils/notifications/notificationSetup';
import { InitialSetupProps } from './types';

const InitialSetup = ({ children }: InitialSetupProps) => {
  const { setThemeMode } = useTheme();

  useEffect(() => {
    setThemeMode('light');
  }, [setThemeMode]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setupNotifications();

    (async () => {
      // TODO: use actual access token
      dispatch(updateSignalRAccessToken('access token'));
      await dispatch(signalRThunks.connect());
    })();
  }, [dispatch]);

  return children;
};

export default InitialSetup;
