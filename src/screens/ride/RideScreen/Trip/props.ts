import { ReactNode } from 'react';
import { BarModes, TimerColorModes } from 'shuttlex-integration';

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

export type TimerStateDataType = {
  timerTime: number;
  mode: TimerColorModes;
  title: ReactNode;
  timerLabel?: string;
};
