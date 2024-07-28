import { FeedbackType, getAxiosErrorInfo } from 'shuttlex-integration';

import shuttlexPassengerInstance from '../../../client';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { TripInfo } from './types';

export const fetchTripInfo = createAppAsyncThunk<TripInfo, void>(
  'trip/fetchTripInfo',
  async (_, { rejectWithValue }) => {
    try {
      //TODO: replace passengerID with actual one
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

export const sendFeedback = createAppAsyncThunk<FeedbackType, FeedbackType>(
  'trip/sendFeedback',
  async (payload, { rejectWithValue }) => {
    try {
      await shuttlexPassengerInstance.post('/passenger/feedback', {
        //TODO: add tripId: tripId,
        rating: payload.rating,
        tip: payload.tip,
      });

      return payload;
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);
