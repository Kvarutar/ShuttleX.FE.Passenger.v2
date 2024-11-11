import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { TicketApiResponse } from './types';

//TODO change for real data
export const getTicketWalletTickets = createAppAsyncThunk<TicketApiResponse, void>(
  'tickets/getTicketWalletTickets',
  async (_, { rejectWithValue, passengerAxios }) => {
    try {
      const response = await passengerAxios.get<TicketApiResponse>('/passenger/ticket/get?passengerId=1');

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
