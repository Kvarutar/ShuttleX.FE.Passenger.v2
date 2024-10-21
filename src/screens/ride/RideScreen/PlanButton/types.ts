import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

export type Plan = {
  Tariffid: number;
  AlgorythmType: 'Eager Fast' | 'Hungarian' | 'Eager Cheap';
  DurationSec: number | null;
};

export type PlanButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  isSelected: boolean;
  plan: Plan;
  style?: StyleProp<ViewStyle>;
  withTimeShow?: boolean;
};
