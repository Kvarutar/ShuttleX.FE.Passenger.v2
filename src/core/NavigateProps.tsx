import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined;
};

export type AuthProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;
