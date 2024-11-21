import { Prize } from '../../../../core/lottery/redux/types';

export type PrizeCardProps = {
  item: Prize;
  onPress: (item: Prize) => void;
};
