import { ReactNode } from 'react';
import { BarModes, TariffType, TimerColorModes } from 'shuttlex-integration';

export type SquareBarProps = {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
  mode?: BarModes;
};

export type TimerStateDataType = {
  timerTime: number;
  mode: TimerColorModes;
  title: ReactNode;
  timerLabel?: string;
};

export type ContractorInfoTestType = {
  tariffType: TariffType;
  total: number;
  capiAmount: number;
  mysteryBoxNumber: number;
};
