import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../redux/hooks';
import { sendFirebaseTokenAPIRequest } from './types';

export const sendFirebaseToken = createAppAsyncThunk<void, string>(
  'notificator/sendFirebaseToken',
  async (payload, { rejectWithValue, notificatorAxios }) => {
    try {
      await notificatorAxios.post('/update-token', {
        firebaseToken: payload,
        userType: 'Passenger',
      } as sendFirebaseTokenAPIRequest);
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
