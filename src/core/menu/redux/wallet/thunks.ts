import Config from 'react-native-config';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { TripInfo } from '../../../ride/redux/trip/types';

export const fetchAvaliablePaymentMethods = createAppAsyncThunk<TripInfo, void>(
  'wallet/fetchAvaliablePaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/order/get?passengerId=1`);

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return (await response.json()) as TripInfo;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
