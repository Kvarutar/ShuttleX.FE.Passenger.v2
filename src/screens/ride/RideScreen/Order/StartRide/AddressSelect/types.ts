import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { SearchAddressFromAPI } from '../../../../../../core/ride/redux/offer/types';

export type PointMode = 'pickUp' | 'default' | 'dropOff';

export type FocusedInput = {
  id: number;
  value: string;
  focus: boolean;
};

export type PointItemProps = {
  style: StyleProp<ViewStyle>;
  pointMode: PointMode;
  currentPointId: number;
  updateFocusedInput: (input: FocusedInput) => void;
  onRemovePoint?: () => void;
};

export type AddressButtonProps = {
  icon: ReactNode;
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export type AddressSelectProps = {
  address?: SearchAddressFromAPI | null;
  setIsAddressSelectVisible: (state: boolean) => void;
  setIsUnsupportedDestinationPopupVisible: (state: boolean) => void;
};
