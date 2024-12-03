import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import {
  getAllCurrentTickets,
  getCurrentActiveLottery,
  getCurrentPrizes,
  getCurrentUpcomingLottery,
  getPreviousLottery,
  getPreviousPrizes,
  getTicketAfterRide,
  getWinnerAvatar,
} from './thunks';
import { LotteryState, TicketFromAPI } from './types';

const initialState: LotteryState = {
  lottery: {
    eventId: '',
    name: '',
    startTime: '',
    state: 'CurrentUpcoming',
  },
  previousLottery: null,
  prizes: [],
  previousPrizes: [],
  tickets: [],
  ticketAfterRide: null,
  loading: {
    previousLottery: false,
    lottery: false,
    prizes: false,
    previousPrizes: false,
    tickets: false,
  },
  error: {
    previousLottery: null,
    lottery: null,
    prizes: null,
    previousPrizes: null,
    tickets: null,
  },
};

//TODO: rewrite caseReducer to use reducers
const slice = createSlice({
  name: 'lottery',
  initialState,
  reducers: {
    clearPrizes: state => {
      state.prizes = initialState.prizes;
      state.previousPrizes = initialState.previousPrizes;
    },
    addTicket(state, action: PayloadAction<TicketFromAPI>) {
      state.tickets.unshift(action.payload);
      setTicketAfterRide(action.payload);
    },
    setTicketAfterRide(state, action: PayloadAction<Nullable<TicketFromAPI>>) {
      state.ticketAfterRide = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // CurrentUpcomingLottery
      .addCase(getCurrentUpcomingLottery.pending, state => {
        state.loading.lottery = true;
        state.error.lottery = null;
      })
      .addCase(getCurrentUpcomingLottery.fulfilled, (state, action) => {
        state.lottery = action.payload;
      })
      .addCase(getCurrentUpcomingLottery.rejected, (state, action) => {
        state.loading.lottery = false;
        state.error.lottery = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      // CurrentActiveLottery
      .addCase(getCurrentActiveLottery.pending, state => {
        state.loading.lottery = true;
        state.error.lottery = null;
      })
      .addCase(getCurrentActiveLottery.fulfilled, (state, action) => {
        state.lottery = action.payload;
      })
      .addCase(getCurrentActiveLottery.rejected, (state, action) => {
        state.loading.lottery = false;
        state.error.lottery = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      // PreviousLottery
      .addCase(getPreviousLottery.pending, state => {
        state.loading.previousLottery = true;
        state.error.previousLottery = null;
      })
      .addCase(getPreviousLottery.fulfilled, (state, action) => {
        state.previousLottery = action.payload;
      })
      .addCase(getPreviousLottery.rejected, (state, action) => {
        state.loading.previousLottery = false;
        state.error.previousLottery = action.payload as NetworkErrorDetailsWithBody<any>;
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
      })

      // PreviousPrizes
      .addCase(getPreviousPrizes.pending, state => {
        state.loading.previousPrizes = true;
        state.error.previousPrizes = null;
      })
      .addCase(getPreviousPrizes.fulfilled, (state, action) => {
        state.loading.previousPrizes = false;
        state.previousPrizes = action.payload;
      })
      .addCase(getPreviousPrizes.rejected, (state, action) => {
        state.loading.previousPrizes = false;
        state.error.previousPrizes = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      // Tickets
      .addCase(getAllCurrentTickets.pending, state => {
        state.loading.tickets = true;
        state.error.tickets = null;
      })
      .addCase(getAllCurrentTickets.fulfilled, (state, action) => {
        state.loading.tickets = false;
        state.tickets = action.payload;
      })
      .addCase(getAllCurrentTickets.rejected, (state, action) => {
        state.loading.tickets = false;
        state.error.tickets = action.payload as NetworkErrorDetailsWithBody<any>;
      })
      .addCase(getTicketAfterRide.fulfilled, (state, action) => {
        slice.caseReducers.addTicket(state, {
          payload: action.payload,
          type: addTicket.type,
        });
        slice.caseReducers.setTicketAfterRide(state, {
          payload: action.payload,
          type: addTicket.type,
        });
      })
      .addCase(getTicketAfterRide.rejected, state => {
        slice.caseReducers.setTicketAfterRide(state, {
          payload: null,
          type: addTicket.type,
        });
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

export const { clearPrizes, addTicket, setTicketAfterRide } = slice.actions;

export default slice.reducer;
