import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { TripInfo } from '../../../ride/redux/trip/types';

export const fetchAvaliablePaymentMethods = createAppAsyncThunk<TripInfo, void>(
  'wallet/fetchAvaliablePaymentMethods',
  async (_, { rejectWithValue, shuttlexPassengerAxios }) => {
    try {
      const response = await shuttlexPassengerAxios.get<TripInfo>('/passenger/order/get?passengerId=1');

      return response.data;
    } catch (error) {
      const { code, body, status } = getNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);
