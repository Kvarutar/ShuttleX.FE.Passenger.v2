import { convertBlobToImgUri, getNetworkErrorInfo, Nullable } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../redux/hooks';
import { orderIdSelector } from '../../ride/redux/trip/selectors';
import {
  GetTicketAfterRideAPIResponse,
  LotteryAPIResponse,
  PrizesAPIResponse,
  TicketAPIResponse,
  WinnerAvatarAPIRequest,
  WinnerAvatarAPIResponse,
} from './types';

export const getCurrentUpcomingLottery = createAppAsyncThunk<LotteryAPIResponse, void>(
  'lottery/getCurrentUpcomingLottery',
  async (_, { rejectWithValue, lotteryAxios }) => {
    try {
      const result = await lotteryAxios.get<LotteryAPIResponse>('/events/current');

      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getCurrentActiveLottery = createAppAsyncThunk<Nullable<LotteryAPIResponse>, void>(
  'lottery/getCurrentActiveLottery',
  async (_, { rejectWithValue, lotteryAxios }) => {
    try {
      const result = await lotteryAxios.get<LotteryAPIResponse[]>('/events', {
        params: { filterBy: 'State::eq::CurrentActive' },
      });

      if (result.data.length === 0) {
        return null;
      }

      return result.data[0];
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getPreviousLottery = createAppAsyncThunk<Nullable<LotteryAPIResponse>, void>(
  'lottery/getPreviousLottery',
  async (_, { rejectWithValue, lotteryAxios }) => {
    try {
      const result = await lotteryAxios.get<LotteryAPIResponse[]>('/events', {
        params: {
          filterBy: 'State::eq::Previous',
          sortBy: 'startTime:asc',
        },
      });

      if (result.data.length === 0) {
        return null;
      }

      return result.data[0];
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getCurrentPrizes = createAppAsyncThunk<PrizesAPIResponse, void>(
  'lottery/getCurrentPrizes',
  async (_, { rejectWithValue, lotteryAxios }) => {
    try {
      const result = await lotteryAxios.get<PrizesAPIResponse>('/events/current/prizes');

      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getPreviousPrizes = createAppAsyncThunk<PrizesAPIResponse, void>(
  'lottery/getPreviousPrizes',
  async (_, { rejectWithValue, lotteryAxios, getState }) => {
    const { lottery } = getState();

    try {
      const result = await lotteryAxios.get<PrizesAPIResponse>('/prizes', {
        params: { filterBy: `EventId::eq::${lottery.previousLottery?.eventId}` },
      });

      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getWinnerAvatar = createAppAsyncThunk<WinnerAvatarAPIResponse, WinnerAvatarAPIRequest>(
  'lottery/getWinnerAvatar',
  async (payload, { rejectWithValue, lotteryAxios }) => {
    try {
      const avatar = await lotteryAxios.get<Blob>(`/prizes/${payload.prizeId}/avatars/${payload.winnerId}`, {
        responseType: 'blob',
      });

      return avatar ? await convertBlobToImgUri(avatar.data) : null;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

// //TODO: uncomment when we need it
// export const getTicketsById = createAppAsyncThunk<TicketAPIResponse, { eventId: string }>(
//   'lottery/getTicketsById',
//   async (payload, { rejectWithValue, lotteryAxios }) => {
//     try {
//       const result = await lotteryAxios.get<TicketAPIResponse>(`/events/${payload.eventId}/tickets`);
//
//       return result.data;
//     } catch (error) {
//       return rejectWithValue(getNetworkErrorInfo(error));
//     }
//   },
// );

export const getAllCurrentTickets = createAppAsyncThunk<TicketAPIResponse, void>(
  'lottery/getAllCurrentTickets',
  async (_, { rejectWithValue, lotteryAxios }) => {
    try {
      const result = await lotteryAxios.get<TicketAPIResponse>('/events/current/tickets');

      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getTicketAfterRide = createAppAsyncThunk<GetTicketAfterRideAPIResponse, void>(
  'lottery/getTicketAfterRide',
  async (_, { rejectWithValue, lotteryAxios, getState }) => {
    const orderId = orderIdSelector(getState());
    try {
      const result = await lotteryAxios.post<GetTicketAfterRideAPIResponse>(
        `/events/current/tickets/orders/${orderId}`,
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
