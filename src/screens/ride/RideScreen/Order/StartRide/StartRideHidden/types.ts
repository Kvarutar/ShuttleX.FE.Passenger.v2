import { StyleProp, ViewStyle } from 'react-native';
import { ButtonProps } from 'shuttlex-integration';

export type AdsContentProps = {
  children?: React.ReactNode;
  isNotAvailable?: boolean;
  buttonProps?: ButtonProps;
  style?: StyleProp<ViewStyle>;
};
