import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

import { Matching } from '../../../../core/ride/redux/offer/types';

export type PlanButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  isSelected: boolean;
  plan: Matching;
  style?: StyleProp<ViewStyle>;
  withTimeShow?: boolean;
};
