import { SharedValue } from 'react-native-reanimated';

export type TicketProps = {
  number: string;
  color: string;
  photo: number;
};

export type TicketCardProps = {
  ticket: TicketProps;
  index: number;
  scrollY: SharedValue<number>;
  activeCardIndex: SharedValue<number | null>;
};
