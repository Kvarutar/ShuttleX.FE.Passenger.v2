import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ButtonProps } from 'shuttlex-integration';

import { PlaceType } from '../PlaceBar/props';

export type StartRideProps = {
  setIsAddressSelectVisible: (state: boolean) => void;
  isAddressSelectVisible: boolean;
};

export type StartRideVisibleProps = {
  openAddressSelect: (state: boolean) => void;
  setFastAddressSelect: (address: PlaceType) => void;
  isBottomWindowOpen: boolean;
};

export type AdsContentProps = {
  children?: React.ReactNode;
  isNotAvailable?: boolean;
  buttonProps?: ButtonProps;
  style?: StyleProp<ViewStyle>;
};

export type RideTextBlockProps = {
  topText: string;
  bottomText: string;
  topStyle: StyleProp<TextStyle>;
  bottomStyle: StyleProp<TextStyle>;
};

export type StartRideRef = {
  openAddressSelect: () => void;
};
