import Config from 'react-native-config';
import { FeedbackType } from 'shuttlex-integration';

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
          throw new Error('Something went wrong');
        }
      }

      return (await response.json()) as TripInfo;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const sendFeedback = createAppAsyncThunk<FeedbackType, FeedbackType>(
  'trip/sendFeedback',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/feedback`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //TODO: add tripId: tripId,
          rating: payload.rating,
          tip: payload.tip,
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return payload;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
