import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Nullable } from 'shuttlex-integration';

import { RecentDropoffsFromAPI } from '../../../../../../core/ride/redux/offer/types';

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
  isInFocus: boolean;
};

export type AddressButtonProps = {
  icon: ReactNode;
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export type AddressSelectProps = {
  address?: Nullable<RecentDropoffsFromAPI>;
  setIsAddressSelectVisible: (state: boolean) => void;
  setIsUnsupportedDestinationPopupVisible: (state: boolean) => void;
};
