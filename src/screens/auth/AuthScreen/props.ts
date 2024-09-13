import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../Navigate/props';

export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export type SignProps = {
  onPress: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Auth', undefined>;
};

export type SignInPhoneStateProps = {
  onLabelPress: () => void;
  changePhoneNumber: (phoneNumber: string | null) => void;
  isCorrectPhoneNumber?: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Auth', undefined>;
};

export type SignInEmailStateProps = {
  onLabelPress: () => void;
  changeEmail: (phoneNumber: string) => void;
  isCorrectEmail: boolean;
};
