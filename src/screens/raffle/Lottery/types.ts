import { ImageSourcePropType } from 'react-native';

import { Prize } from '../../../core/lottery/redux/types';

export type LotteryProps = {
  triggerConfetti: () => void;
};

export type PrizeData = {
  name: string;
  image: ImageSourcePropType;
  description: string | null;
};

export type PrizePodiumProps = {
  prizes: Prize[];
  handleSurprisesPress: (prize: Prize) => void;
};
