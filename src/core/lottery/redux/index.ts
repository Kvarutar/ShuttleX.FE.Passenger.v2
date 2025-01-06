import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import {
  getAllCurrentTickets,
  getCurrentActiveLottery,
  getCurrentPrizes,
  getCurrentUpcomingLottery,
  getPreviousLottery,
  getPreviousPrizes,
  getTicketByOrderId,
  getWinnerAvatar,
} from './thunks';
import { LotteryMode, LotteryState, SetAvatarStatePayloadType, TicketFromAPI, WinnerPrizesAPIResponse } from './types';

const initialState: LotteryState = {
  lottery: {
    eventId: '',
    name: '',
    startTime: '',
    state: 'CurrentUpcoming',
  },
  previousLottery: null,
  prizes: {
    data: [],
    avatars: [],
  },
  selectedMode: 'current',
  winnerPrizes: {
    ticket: '',
    prizeIds: [],
  },
  previousPrizes: {
    data: [],
    avatars: [],
  },
  tickets: [],
  ticketAfterRide: null,
  loading: {
    ticketAfterRide: false,
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
    setLotterySelectedMode: (state, action: PayloadAction<LotteryMode>) => {
      state.selectedMode = action.payload;
    },
    clearPrizes: state => {
      state.prizes = initialState.prizes;
      state.previousPrizes = initialState.previousPrizes;
    },
    setTicketAfterRide(state, action: PayloadAction<Nullable<TicketFromAPI>>) {
      state.ticketAfterRide = action.payload;
    },
    //TODO call when lottery is done
    clearTicketList(state) {
      state.tickets = [];
    },
    setWinnerPrizes(state, action: PayloadAction<Nullable<WinnerPrizesAPIResponse>>) {
      state.winnerPrizes = action.payload;
    },
    setAvatarState(state, action: PayloadAction<SetAvatarStatePayloadType>) {
      const { winnerId, imageUrl, isLoading } = action.payload;
      const selectedPrizes = state.selectedMode === 'history' ? state.previousPrizes : state.prizes;
      const prize = selectedPrizes.data.find(item => item.winnerId === winnerId);

      if (prize) {
        const avatarIndex = selectedPrizes.avatars.findIndex(avatar => avatar.index === prize.index);

        if (avatarIndex !== -1) {
          selectedPrizes.avatars[avatarIndex] = {
            index: prize.index,
            imageUrl,
            isLoading,
          };
        } else {
          selectedPrizes.avatars.push({
            index: prize.index,
            imageUrl,
            isLoading,
          });
        }
      }
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
        state.loading.lottery = false;
        state.error.lottery = null;
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
        state.prizes.data = action.payload;
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
        state.previousPrizes.data = action.payload;
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

      .addCase(getTicketByOrderId.pending, state => {
        state.loading.ticketAfterRide = true;
      })
      .addCase(getTicketByOrderId.fulfilled, (state, action) => {
        state.loading.ticketAfterRide = false;
        state.ticketAfterRide = action.payload;
      })
      .addCase(getTicketByOrderId.rejected, state => {
        state.loading.ticketAfterRide = false;
        state.ticketAfterRide = null;
      })

      //WinnerAvatar
      .addCase(getWinnerAvatar.pending, (state, action) => {
        const { winnerId } = action.meta.arg;
        slice.caseReducers.setAvatarState(state, {
          payload: { winnerId, imageUrl: null, isLoading: true },
          type: slice.actions.setAvatarState.type,
        });
      })
      .addCase(getWinnerAvatar.fulfilled, (state, action) => {
        const { winnerId } = action.meta.arg;
        slice.caseReducers.setAvatarState(state, {
          payload: { winnerId, imageUrl: action.payload, isLoading: false },
          type: slice.actions.setAvatarState.type,
        });
      })
      .addCase(getWinnerAvatar.rejected, (state, action) => {
        const { winnerId } = action.meta.arg;
        slice.caseReducers.setAvatarState(state, {
          payload: { winnerId, imageUrl: null, isLoading: false },
          type: slice.actions.setAvatarState.type,
        });
      });
  },
});

export const { setLotterySelectedMode, clearPrizes, setTicketAfterRide, setWinnerPrizes } = slice.actions;

export default slice.reducer;
