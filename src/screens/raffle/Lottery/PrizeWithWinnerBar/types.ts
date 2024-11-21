import { ImageSourcePropType } from 'react-native';
import { Nullable } from 'shuttlex-integration';

export type PrizeWithWinnerBarProps = {
  index: number;
  prizeImage: ImageSourcePropType;
  prizeTitle: string;
  prizeId: string;
  winnerId: Nullable<string>;
  ticketCode: Nullable<string>;
  winnerName: Nullable<string>;
};
