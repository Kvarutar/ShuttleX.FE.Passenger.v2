import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../../Navigate/props';

export type OrderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Ride', undefined>;
};

export type OrderRef = {
  openAddressSelect: () => void;
};
