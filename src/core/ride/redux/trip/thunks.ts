import Config from 'react-native-config';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { TripInfo } from './types';

export const fetchTripInfo = createAppAsyncThunk<TripInfo, void>(
  'trip/fetchTripInfo',
  async (_, { rejectWithValue }) => {
    try {
      //TODO: replace passengerID with actual one
      const response = await fetch(`${Config.API_URL_HTTPS}/Order/get?passengerId=1`);

      if (!response.ok) {
        if (response.status === 404) {
          fetchTripInfo();
        } else {
          return rejectWithValue(await response.json());
        }
      }

      return (await response.json()) as TripInfo;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
