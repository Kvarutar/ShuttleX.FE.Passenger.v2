import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../redux/hooks';
import { LotteryAPIResponse, Prize, PrizesAPIResponse, TicketAPIResponse } from './types';

//TODO: uncomment when we need to add history logic
// export const getAllLotteries = createAppAsyncThunk<LotteryAPIResponse[], LotteryFilterOptions>(
//   'lottery/getAllLotteries',
//   async (payload, { rejectWithValue, lotteryAxios }) => {
//     try {
//       const params = {
//         amount: payload.amount,
//         offset: payload.offset,
//         sortBy: payload.sortBy,
//         filterBy: payload.filterBy,
//       };
//
//       const result = await lotteryAxios.get<LotteryAPIResponse[]>('/events', { params });
//
//       return result.data;
//     } catch (error) {
//       const { code, body, status } = getNetworkErrorInfo(error);
//       return rejectWithValue({
//         code,
//         body,
//         status,
//       });
//     }
//   },
// );

export const getCurrentLottery = createAppAsyncThunk<LotteryAPIResponse, void>(
  'lottery/getCurrentLottery',
  async (_, { rejectWithValue, lotteryAxios }) => {
    try {
      const result = await lotteryAxios.get<LotteryAPIResponse>('/events/current');

      return result.data;
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

//TODO: uncomment when we need to add history logic
// export const getAllPrizes = createAppAsyncThunk<PrizesAPIResponse[], LotteryFilterOptions>(
//   'lottery/getAllPrizes',
//   async (payload, { rejectWithValue, lotteryAxios }) => {
//     try {
//       const params = {
//         amount: payload.amount,
//         offset: payload.offset,
//         sortBy: payload.sortBy,
//         filterBy: payload.filterBy,
//       };
//
//       const result = await lotteryAxios.get<PrizesAPIResponse[]>('/prizes', { params });
//
//       return result.data;
//     } catch (error) {
//       const { code, body, status } = getNetworkErrorInfo(error);
//       return rejectWithValue({
//         code,
//         body,
//         status,
//       });
//     }
//   },
// );

let currentIndex = 4;

export const getCurrentPrizes = createAppAsyncThunk<PrizesAPIResponse[], void>(
  'lottery/getCurrentPrizes',
  async (_, { rejectWithValue, getState }) => {
    try {
      //TODO: use result when data from BE will be correct
      // const result = await lotteryAxios.get<PrizesAPIResponse[]>('/events/current/prizes');

      const state = getState();

      const updatedPrizes: Prize[] = state.lottery.prizes.map(prize => {
        if (prize.index === currentIndex) {
          return {
            ...prize,
            winnerId: `${currentIndex}`,
            ticketNumber: `${currentIndex}`,
            winnerFirstName: `John${currentIndex}`,
          };
        } else {
          return prize;
        }
      });

      currentIndex = currentIndex === 0 ? currentIndex : currentIndex - 1;

      await new Promise(resolve => setTimeout(resolve, 1000));

      return updatedPrizes;
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

export const getWinnerAvatar = createAppAsyncThunk<string, { prizeId: string; winnerId: string }>(
  'lottery/getWinnerAvatar',
  async (payload, { rejectWithValue }) => {
    try {
      //TODO: use result when data from BE will be correct
      // const result = await lotteryAxios.get<string>(`/prizes/${payload.prizeId}/avatars/${payload.winnerId}`);

      const mockAvatars: Record<string, string> = {
        0: 'https://s3-alpha-sig.figma.com/img/9446/d564/bd2ec06179682d62415780b8d0976216?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=asXkku9hzOkD4gS295RqStzvF937gRSwT~REzBfzcaGAh8NoH97Mc5SPoaPWSutgbYwoqaDTMZMH6P-WaoQdTEnfPjtdh5esnXPpGcrBFEQsFkPRVlqsmicS-Qi2Bf5bUP~I4pA7rtlrd0dBGipsXdIo8sUVClkDBOWqnJi7JnA2VQ-oP9MbzV82Vifdgm~WZA1tra2t5syPQwZ0Drk3o9LeKnAVx6D11fpYZ7ziwd~ror22dnHNibb0zrGg4Hbe7yu3-V1nP-NS3zG89aT75lZFBIJYKCQLLfwWrtwVdhicqxCgzwVgNcjnqsUBJF~YMILZ1OPHPT5N4i86sHYTCQ__',
        1: 'https://s3-alpha-sig.figma.com/img/9446/d564/bd2ec06179682d62415780b8d0976216?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=asXkku9hzOkD4gS295RqStzvF937gRSwT~REzBfzcaGAh8NoH97Mc5SPoaPWSutgbYwoqaDTMZMH6P-WaoQdTEnfPjtdh5esnXPpGcrBFEQsFkPRVlqsmicS-Qi2Bf5bUP~I4pA7rtlrd0dBGipsXdIo8sUVClkDBOWqnJi7JnA2VQ-oP9MbzV82Vifdgm~WZA1tra2t5syPQwZ0Drk3o9LeKnAVx6D11fpYZ7ziwd~ror22dnHNibb0zrGg4Hbe7yu3-V1nP-NS3zG89aT75lZFBIJYKCQLLfwWrtwVdhicqxCgzwVgNcjnqsUBJF~YMILZ1OPHPT5N4i86sHYTCQ__',
        2: 'https://s3-alpha-sig.figma.com/img/9446/d564/bd2ec06179682d62415780b8d0976216?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=asXkku9hzOkD4gS295RqStzvF937gRSwT~REzBfzcaGAh8NoH97Mc5SPoaPWSutgbYwoqaDTMZMH6P-WaoQdTEnfPjtdh5esnXPpGcrBFEQsFkPRVlqsmicS-Qi2Bf5bUP~I4pA7rtlrd0dBGipsXdIo8sUVClkDBOWqnJi7JnA2VQ-oP9MbzV82Vifdgm~WZA1tra2t5syPQwZ0Drk3o9LeKnAVx6D11fpYZ7ziwd~ror22dnHNibb0zrGg4Hbe7yu3-V1nP-NS3zG89aT75lZFBIJYKCQLLfwWrtwVdhicqxCgzwVgNcjnqsUBJF~YMILZ1OPHPT5N4i86sHYTCQ__',
        3: 'https://s3-alpha-sig.figma.com/img/9446/d564/bd2ec06179682d62415780b8d0976216?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=asXkku9hzOkD4gS295RqStzvF937gRSwT~REzBfzcaGAh8NoH97Mc5SPoaPWSutgbYwoqaDTMZMH6P-WaoQdTEnfPjtdh5esnXPpGcrBFEQsFkPRVlqsmicS-Qi2Bf5bUP~I4pA7rtlrd0dBGipsXdIo8sUVClkDBOWqnJi7JnA2VQ-oP9MbzV82Vifdgm~WZA1tra2t5syPQwZ0Drk3o9LeKnAVx6D11fpYZ7ziwd~ror22dnHNibb0zrGg4Hbe7yu3-V1nP-NS3zG89aT75lZFBIJYKCQLLfwWrtwVdhicqxCgzwVgNcjnqsUBJF~YMILZ1OPHPT5N4i86sHYTCQ__',
        4: 'https://s3-alpha-sig.figma.com/img/9446/d564/bd2ec06179682d62415780b8d0976216?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=asXkku9hzOkD4gS295RqStzvF937gRSwT~REzBfzcaGAh8NoH97Mc5SPoaPWSutgbYwoqaDTMZMH6P-WaoQdTEnfPjtdh5esnXPpGcrBFEQsFkPRVlqsmicS-Qi2Bf5bUP~I4pA7rtlrd0dBGipsXdIo8sUVClkDBOWqnJi7JnA2VQ-oP9MbzV82Vifdgm~WZA1tra2t5syPQwZ0Drk3o9LeKnAVx6D11fpYZ7ziwd~ror22dnHNibb0zrGg4Hbe7yu3-V1nP-NS3zG89aT75lZFBIJYKCQLLfwWrtwVdhicqxCgzwVgNcjnqsUBJF~YMILZ1OPHPT5N4i86sHYTCQ__',
      };

      return mockAvatars[payload.winnerId];
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

// //TODO: uncomment when we need it
// export const getTicketsById = createAppAsyncThunk<TicketAPIResponse, { eventId: string }>(
//   'lottery/getTicketsById',
//   async (payload, { rejectWithValue, lotteryAxios }) => {
//     try {
//       const result = await lotteryAxios.get<TicketAPIResponse>(`/events/${payload.eventId}/tickets`);
//
//       return result.data;
//     } catch (error) {
//       const { code, body, status } = getNetworkErrorInfo(error);
//       return rejectWithValue({
//         code,
//         body,
//         status,
//       });
//     }
//   },
// );

export const getCurrentTickets = createAppAsyncThunk<TicketAPIResponse, void>(
  'lottery/getCurrentTickets',
  async (_, { rejectWithValue, lotteryAxios }) => {
    try {
      const result = await lotteryAxios.get<TicketAPIResponse>('/events/current/tickets');

      return result.data;
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
