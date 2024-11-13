import { getAuthNetworkErrorInfo } from '../auth/redux/errors/errors';
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
      const { code, body, status } = getAuthNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);
