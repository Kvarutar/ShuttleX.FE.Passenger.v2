import { Address } from 'react-native-maps';
import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';

export const fetchAddresses = createAppAsyncThunk<Address[], string>(
  'order/fetchAddresses',
  async (payload, { rejectWithValue, passengerAxios }) => {
    try {
      const result = await passengerAxios.get<Address[]>(`/passenger/map/addresses?addressPart=${payload}`);

      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
