import { type StyleProp, type ViewStyle } from 'react-native';

export type AddressPopupProps = {
  children: React.ReactNode;
  showConfirmButton: boolean;
  style?: StyleProp<ViewStyle>;
  onCloseButtonPress?: () => void;
  onBackButtonPress?: () => void;
  barStyle?: StyleProp<ViewStyle>;
  additionalTopButtons?: React.ReactNode;
  onConfirm?: () => void;
};
