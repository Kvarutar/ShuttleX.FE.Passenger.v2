import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { CircleButtonModes } from 'shuttlex-integration';

export type SmallButtonProps = {
  icon: ReactNode;
  onPress: () => void;
  containerStyle?: ViewStyle;
  mode?: CircleButtonModes;
};
