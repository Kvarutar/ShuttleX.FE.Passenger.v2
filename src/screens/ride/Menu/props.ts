import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from './../../../Navigate/props';

export type MenuProps = {
  onClose: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Ride', undefined>;
};
