import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getTicketWalletTickets } from './thunks';
import { TicketWalletState } from './types';

const initialState: TicketWalletState = {
  tickets: [
    //TODO just for tests
    { number: '56748909' },
    { number: '56748909' },
    { number: '56748909' },
    { number: '56748909' },
    { number: '56748909' },
  ],
};

const slice = createSlice({
  name: 'ticketWallet',
  initialState,
  reducers: {
    setTicketList(state, action: PayloadAction<string[]>) {
      state.tickets = action.payload.map(ticket => ({ number: ticket }));
    },
    clearTicketList(state) {
      state.tickets = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(getTicketWalletTickets.fulfilled, (state, action) => {
      state.tickets = action.payload.tickets.map(ticket => ({ number: ticket }));
    });
  },
});

export const { clearTicketList, setTicketList } = slice.actions;
export default slice.reducer;
