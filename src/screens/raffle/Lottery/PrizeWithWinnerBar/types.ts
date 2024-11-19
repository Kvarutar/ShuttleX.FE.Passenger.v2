import { ImageSourcePropType } from 'react-native';

export type PrizeWithWinnerBarProps = {
  index: number;
  prizeImage: ImageSourcePropType;
  prizeTitle: string;
  winnerImage: string;
  winnerName: string;
  ticketCode?: string;
};
