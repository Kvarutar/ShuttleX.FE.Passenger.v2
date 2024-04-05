import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../../../Navigate/props';

export type AddressSelectMode = 'now' | 'delayed';

export type AddressSelectProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Ride', undefined>;
  closeAddressSelect: () => void;
  addressSelectMode: AddressSelectMode;
};

export type PointMode = 'pickUp' | 'default' | 'dropOff';

export type PointItemProps = {
  pointMode: PointMode;
  content: string;
  onRemovePoint?: () => void;
  currentPointId: number;
};
