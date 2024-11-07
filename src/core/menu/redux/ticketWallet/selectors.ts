import { AppState } from '../../../redux/store';

export const ticketWalletTicketsSelector = (state: AppState) => state.ticketWallet.tickets;
