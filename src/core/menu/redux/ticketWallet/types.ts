type Ticket = {
  number: string;
};

export type TicketWalletState = {
  tickets: Ticket[];
};

export type TicketApiResponse = {
  tickets: string[];
};
