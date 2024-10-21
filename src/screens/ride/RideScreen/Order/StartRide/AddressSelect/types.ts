import { StyleProp, ViewStyle } from 'react-native';

import { PlaceType } from '../../PlaceBar/types';

export type PointMode = 'pickUp' | 'default' | 'dropOff';

export type PointItemProps = {
  style: StyleProp<ViewStyle>;
  pointMode: PointMode;
  onRemovePoint?: () => void;
  currentPointId: number;
  setFocusedInput: (input: { id: number; value: string; focus: boolean }) => void;
};

export type AddressButtonProps = {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export type AddressSelectProps = {
  address?: PlaceType | null;
  setIsAddressSelectVisible: (state: boolean) => void;
};
