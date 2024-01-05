import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../Navigate/props';

export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export type SignProps = {
  onPress: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Auth', undefined>;
};

export type SignInPhoneAndEmailStateProps = {
  onLabelPress: () => void;
};
