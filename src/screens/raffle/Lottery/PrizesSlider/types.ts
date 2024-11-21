import { Prize } from '../../../../core/lottery/redux/types';

export type PrizesSliderProps = {
  visible: boolean;
  selectedItemIndex: number;
  onClose: () => void;
  listItem: Prize[];
};
