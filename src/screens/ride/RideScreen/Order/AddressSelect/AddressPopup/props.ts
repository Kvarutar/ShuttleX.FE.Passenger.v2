import { type StyleProp, type ViewStyle } from 'react-native';

export type AddressPopupProps = {
  children: React.ReactNode;
  showConfirmButton: boolean;
  style?: StyleProp<ViewStyle>;
  onBackButtonPress?: () => void;
  barStyle?: StyleProp<ViewStyle>;
  additionalTopButtons?: React.ReactNode;
  onConfirm?: () => void;
};
