import { getAxiosErrorInfo } from 'shuttlex-integration';

import shuttlexPassengerInstance from '../../../client';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { TripInfo } from '../../../ride/redux/trip/types';

export const fetchAvaliablePaymentMethods = createAppAsyncThunk<TripInfo, void>(
  'wallet/fetchAvaliablePaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await shuttlexPassengerInstance.get<TripInfo>('/passenger/order/get?passengerId=1');

      return response.data;
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);
