import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

export type LotteryState = {
  lottery: Nullable<LotteryAPIResponse>;
  previousLottery: Nullable<LotteryAPIResponse>;
  prizes: Prize[];
  previousPrizes: Prize[];
  tickets: TicketAPIResponse;
  loading: {
    previousLottery: boolean;
    lottery: boolean;
    prizes: boolean;
    previousPrizes: boolean;
    tickets: boolean;
  };
  error: {
    previousLottery: Nullable<NetworkErrorDetailsWithBody<any>>;
    lottery: Nullable<NetworkErrorDetailsWithBody<any>>;
    prizes: Nullable<NetworkErrorDetailsWithBody<any>>;
    previousPrizes: Nullable<NetworkErrorDetailsWithBody<any>>;
    tickets: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
};

export type LotteryAPIResponse = {
  eventId: string;
  name: string;
  startTime: string;
  state: 'CurrentUpcoming' | 'CurrentActive' | 'Previous';
};

export type PrizesAPIResponse = {
  prizes: {
    prizeId: string;
    name: string;
    feKey: string;
  }[];
  index: number;
  winnerId: Nullable<string>;
  winnerFirstName: Nullable<string>;
  ticketNumber: Nullable<string>;
}[];

export type Prize = PrizesAPIResponse[0] & {
  avatar?: {
    imageUrl: Nullable<string>;
    isLoading: boolean;
  };
};

export type TicketAPIResponse = {
  ticketNumber: string;
}[];

export type WinnerAvatarAPIResponse = string;

export type WinnerAvatarAPIRequest = { prizeId: string; winnerId: string };

export type LotteryFilterOptions = {
  amount?: number;
  offset?: number;
  sortBy?: string;
  filterBy?: string;
};
