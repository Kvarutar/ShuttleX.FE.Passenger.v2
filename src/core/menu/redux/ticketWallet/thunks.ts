import { getAxiosErrorInfo } from 'shuttlex-integration';

import shuttlexPassengerInstance from '../../../client';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { TicketApiResponse } from './types';

//TODO change for real data
export const getTicketWalletTickets = createAppAsyncThunk<TicketApiResponse, void>(
  'tickets/getTicketWalletTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await shuttlexPassengerInstance.get<TicketApiResponse>('/passenger/ticket/get?passengerId=1');

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
