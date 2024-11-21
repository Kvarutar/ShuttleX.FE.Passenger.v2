import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

export type LotteryState = {
  lottery: LotteryAPIResponse;
  prizes: Prize[];
  tickets: TicketAPIResponse;
  loading: {
    lottery: boolean;
    prizes: boolean;
    tickets: boolean;
  };
  error: {
    lottery: Nullable<NetworkErrorDetailsWithBody<any>>;
    prizes: Nullable<NetworkErrorDetailsWithBody<any>>;
    tickets: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
};

export type LotteryAPIResponse = {
  eventId: string;
  name: string;
  startTime: string;
  state: 'CurrentUpcoming' | 'CurrentActive';
};

export type Prize = PrizesAPIResponse & {
  avatar?: {
    imageUrl: Nullable<string>;
    isLoading: boolean;
  };
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
};

export type TicketAPIResponse = {
  ticketNumber: string;
}[];

export type LotteryFilterOptions = {
  amount?: number;
  offset?: number;
  sortBy?: string;
  filterBy?: string;
};
