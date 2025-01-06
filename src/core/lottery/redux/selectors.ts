import { type AppState } from '../../redux/store';

export const lotteryIdSelector = (state: AppState) => state.lottery.lottery?.eventId;
export const lotteryStartTimeSelector = (state: AppState) => state.lottery.lottery?.startTime;
export const lotteryStateSelector = (state: AppState) => state.lottery.lottery?.state;
export const lotteryPrizesSelector = (state: AppState) => state.lottery.prizes.data;
export const lotteryTicketsSelector = (state: AppState) => state.lottery.tickets;
export const previousLotteryIdSelector = (state: AppState) => state.lottery.previousLottery?.eventId;
export const lotteryPreviousPrizesSelector = (state: AppState) => state.lottery.previousPrizes.data;
export const lotteryTicketAfterRideSelector = (state: AppState) => state.lottery.ticketAfterRide;
export const lotteryWinnerSelector = (state: AppState) => state.lottery.winnerPrizes;

export const isLotteryLoadingSelector = (state: AppState) => state.lottery.loading.lottery;
export const isPrizesLoadingSelector = (state: AppState) => state.lottery.loading.prizes;
export const isTicketsLoadingSelector = (state: AppState) => state.lottery.loading.tickets;
export const isTicketAfterRideLoadingSelector = (state: AppState) => state.lottery.loading.ticketAfterRide;
export const isPreviousLotteryLoadingSelector = (state: AppState) => state.lottery.loading.previousLottery;
export const isPreviousPrizesLoadingSelector = (state: AppState) => state.lottery.loading.previousPrizes;

export const lotteryErrorSelector = (state: AppState) => state.lottery.error.lottery;
export const prizesErrorSelector = (state: AppState) => state.lottery.error.prizes;
export const ticketsErrorSelector = (state: AppState) => state.lottery.error.tickets;
export const previousLotteryErrorSelector = (state: AppState) => state.lottery.error.previousLottery;
export const previousPrizesErrorSelector = (state: AppState) => state.lottery.error.previousPrizes;

export const isAvatarLoadingSelector = (winnerId?: string | null) => (state: AppState) => {
  const prizes = state.lottery.selectedMode === 'history' ? state.lottery.previousPrizes : state.lottery.prizes;
  const avatar = prizes.data.find(item => item.winnerId === winnerId)?.index;

  return prizes.avatars.find(item => item.index === avatar)?.isLoading ?? false;
};

export const winnerAvatarSelector = (winnerId?: string | null) => (state: AppState) => {
  const prizes = state.lottery.selectedMode === 'history' ? state.lottery.previousPrizes : state.lottery.prizes;
  const avatar = prizes.data.find(item => item.winnerId === winnerId)?.index;

  return prizes.avatars.find(item => item.index === avatar)?.imageUrl ?? null;
};
