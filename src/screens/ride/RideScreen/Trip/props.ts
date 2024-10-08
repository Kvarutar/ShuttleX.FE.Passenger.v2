import { BarModes } from 'shuttlex-integration';

export type SquareBarProps = {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
  mode?: BarModes;
};

export type VisiblePartProps = {
  extraSum: number;
  setExtraSum: (value: number | ((prev: number) => number)) => void;
};
