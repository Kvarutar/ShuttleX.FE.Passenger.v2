import { StyleProp, ViewStyle } from 'react-native';

import { SearchAddressFromAPI } from '../../../../../core/ride/redux/offer/types';

export enum PlaceBarModes {
  Default = 'default',
  Search = 'search',
  Save = 'save',
}

export type PlaceBarProps = {
  mode?: PlaceBarModes;
  place: SearchAddressFromAPI;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export type PlaceTitleProps = {
  withDistance?: boolean;
  place: SearchAddressFromAPI;
  style?: StyleProp<ViewStyle>;
};
