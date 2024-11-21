import { createSlice } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { getCurrentLottery, getCurrentPrizes, getCurrentTickets, getWinnerAvatar } from './thunks';
import { LotteryState } from './types';

//TODO: delete testData when data from BE will be correct
const initialState: LotteryState = {
  lottery: {
    eventId: 'test',
    name: 'test',
    startTime: '2025-01-02',
    state: 'CurrentActive',
  },
  prizes: [
    {
      prizes: [
        {
          prizeId: 'prize1',
          name: 'iPhone 16 Pro',
          feKey: 'iPhone 16 Pro',
        },
      ],
      index: 0,
      winnerId: null,
      winnerFirstName: null,
      ticketNumber: null,
    },
    {
      prizes: [
        {
          prizeId: 'prize2',
          name: 'iPhone 16',
          feKey: 'iPhone 16',
        },
      ],
      index: 1,
      winnerId: null,
      winnerFirstName: null,
      ticketNumber: null,
    },
    {
      prizes: [
        {
          prizeId: 'prize3',
          name: 'iPhone 15',
          feKey: 'iPhone 15',
        },
      ],
      index: 2,
      winnerId: null,
      winnerFirstName: null,
      ticketNumber: null,
    },
    {
      prizes: [
        {
          prizeId: 'prize4',
          name: 'Nothing Ear (3)',
          feKey: 'Nothing Ear (3)',
        },
      ],
      index: 3,
      winnerId: null,
      winnerFirstName: null,
      ticketNumber: null,
    },
    {
      prizes: [
        {
          prizeId: 'prize5',
          name: 'Nothing Ear (2)',
          feKey: 'Nothing Ear (2)',
        },
      ],
      index: 4,
      winnerId: null,
      winnerFirstName: null,
      ticketNumber: null,
    },
  ],
  tickets: [],
  loading: {
    lottery: false,
    prizes: false,
    tickets: false,
  },
  error: {
    lottery: null,
    prizes: null,
    tickets: null,
  },
};

const slice = createSlice({
  name: 'lottery',
  initialState,
  reducers: {
    clearPrizes: state => {
      state.prizes = initialState.prizes;
    },
  },
  extraReducers: builder => {
    builder
      // Lottery
      .addCase(getCurrentLottery.pending, state => {
        state.loading.lottery = true;
        state.error.lottery = null;
      })
      .addCase(getCurrentLottery.fulfilled, (state, action) => {
        state.lottery = action.payload;
      })
      .addCase(getCurrentLottery.rejected, (state, action) => {
        state.loading.lottery = false;
        state.error.lottery = action.payload as NetworkErrorDetailsWithBody<any>;
        console.error(action.payload);
      })

      // Prizes
      .addCase(getCurrentPrizes.pending, state => {
        state.loading.prizes = true;
        state.error.prizes = null;
      })
      .addCase(getCurrentPrizes.fulfilled, (state, action) => {
        state.loading.prizes = false;
        state.prizes = action.payload;
      })
      .addCase(getCurrentPrizes.rejected, (state, action) => {
        state.loading.prizes = false;
        state.error.prizes = action.payload as NetworkErrorDetailsWithBody<any>;
        console.error(action.payload);
      })

      // Tickets
      .addCase(getCurrentTickets.pending, state => {
        state.loading.tickets = true;
        state.error.tickets = null;
      })
      .addCase(getCurrentTickets.fulfilled, (state, action) => {
        state.loading.tickets = false;
        state.tickets = action.payload;
      })
      .addCase(getCurrentTickets.rejected, (state, action) => {
        state.loading.tickets = false;
        state.error.tickets = action.payload as NetworkErrorDetailsWithBody<any>;
        console.error(action.payload);
      })

      //WinnerAvatar
      .addCase(getWinnerAvatar.pending, (state, action) => {
        const { winnerId } = action.meta.arg;
        const prize = state.prizes.find(item => item.winnerId === winnerId);
        if (prize) {
          prize.avatar = {
            imageUrl: null,
            isLoading: true,
          };
        }
      })
      .addCase(getWinnerAvatar.fulfilled, (state, action) => {
        const { winnerId } = action.meta.arg;
        const prize = state.prizes.find(item => item.winnerId === winnerId);
        if (prize) {
          prize.avatar = {
            imageUrl: action.payload,
            isLoading: false,
          };
        }
      })
      .addCase(getWinnerAvatar.rejected, (state, action) => {
        const { winnerId } = action.meta.arg;
        const prize = state.prizes.find(item => item.winnerId === winnerId);
        if (prize && prize.avatar) {
          prize.avatar = {
            imageUrl: null,
            isLoading: false,
          };
        }
      });
  },
});

export const { clearPrizes } = slice.actions;

export default slice.reducer;
