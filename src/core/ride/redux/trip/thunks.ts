import { FeedbackType, getAxiosErrorInfo } from 'shuttlex-integration';

import shuttlexPassengerInstance from '../../../client';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { ContractorInfo, TripInfo } from './types';

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

export const fetchContractorInfo = createAppAsyncThunk<ContractorInfo, string>(
  'trip/fetchContractorInfo',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await shuttlexPassengerInstance.get<ContractorInfo>(`/api/v1/order/${orderId}`);
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

// async thunk for canceling ride by passenger
//TODO make a real post request to back
export const cancelTrip = createAppAsyncThunk('trip/cancelTrip', async (_, { rejectWithValue }) => {
  try {
    const response = await shuttlexPassengerInstance.post('/api/trips/cancel', {
      message: 'Passenger cancelled the trip',
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
export const sendMysteryBoxPopupResponse = createAppAsyncThunk<void, { passengerId: string; res: boolean }>(
  'trip/sendMysteryBoxPopupResponse',
  async () => {
    //TODO: Add networking
    // try {
    //   // const response = await shuttlexPassengerInstance.post<TripInfo>(`/passenger/trip/mystery-box/${passengerId}`);
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
  },
);
