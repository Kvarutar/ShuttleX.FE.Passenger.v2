import { useEffect } from 'react';

import { setupNotifications } from '../core/utils/notifications/notificationSetup';
import { InitialSetupProps } from './types';

const InitialSetup = ({ children }: InitialSetupProps) => {
  useEffect(() => {
    setupNotifications();
  }, []);

  return children;
};

export default InitialSetup;
