import { Prize } from '../types';

export type PrizeCardProps = {
  item: Prize;
  onPress: (item: Prize) => void;
};
