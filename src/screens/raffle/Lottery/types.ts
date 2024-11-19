import { ImageSourcePropType } from 'react-native';

export type LotteryProps = {
  triggerConfetti: () => void;
};

export type Prize = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  description: string | null;
  index: number;
  winnerProfile?: Winner;
};

export type Winner = {
  id: string;
  name: string;
  imageUrl: string;
  ticketCode?: string;
};
