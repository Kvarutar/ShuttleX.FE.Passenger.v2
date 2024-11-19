import { Prize } from '../types';

export type PrizesSliderProps = {
  visible: boolean;
  selectedItemIndex: number;
  onClose: () => void;
  listItem: Prize[];
};
