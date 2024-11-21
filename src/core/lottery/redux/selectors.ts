import { type AppState } from '../../redux/store';

export const lotteryIdSelector = (state: AppState) => state.lottery.lottery.eventId;
export const lotteryStartTimeSelector = (state: AppState) => state.lottery.lottery.startTime;
export const lotteryStateSelector = (state: AppState) => state.lottery.lottery.state;
export const lotteryPrizesSelector = (state: AppState) => state.lottery.prizes;
export const lotteryTicketsSelector = (state: AppState) => state.lottery.tickets;

export const isLotteryLoadingSelector = (state: AppState) => state.lottery.loading.lottery;
export const isPrizesLoadingSelector = (state: AppState) => state.lottery.loading.prizes;
export const isTicketsLoadingSelector = (state: AppState) => state.lottery.loading.tickets;

export const lotteryErrorSelector = (state: AppState) => state.lottery.error.lottery;
export const prizesErrorSelector = (state: AppState) => state.lottery.error.prizes;
export const ticketsErrorSelector = (state: AppState) => state.lottery.error.tickets;

export const isAvatarLoadingSelector = (winnerId?: string | null) => (state: AppState) => {
  const prize = state.lottery.prizes.find(item => item.winnerId === winnerId);
  return prize?.avatar?.isLoading;
};

export const winnerAvatarSelector = (winnerId?: string | null) => (state: AppState) => {
  const prize = state.lottery.prizes.find(item => item.winnerId === winnerId);
  return prize?.avatar?.imageUrl;
};
