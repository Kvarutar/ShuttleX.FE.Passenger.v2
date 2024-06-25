import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleProp, ViewStyle } from 'react-native';

import { RootStackParamList } from '../../../Navigate/props';

export type PhoneSelectScreenProps = NativeStackScreenProps<RootStackParamList, 'PhoneSelect'>;

export type ListItemProps = {
  style?: StyleProp<ViewStyle>;
  withCheck?: boolean;
  onPress?: () => void;
  icc?: number;
  countryName?: string;
  iconSvg?: JSX.Element;
};
