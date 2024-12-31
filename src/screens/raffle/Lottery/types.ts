import { ImageSourcePropType } from 'react-native';

export type LotteryProps = {
  triggerConfetti: () => void;
};

export type PrizeData = {
  name: string;
  image: ImageSourcePropType;
  description: string | null;
};
