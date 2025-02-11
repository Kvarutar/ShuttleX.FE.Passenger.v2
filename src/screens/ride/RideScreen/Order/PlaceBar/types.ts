import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { SearchAddressFromAPI } from '../../../../../core/ride/redux/offer/types';

export enum PlaceBarModes {
  DefaultAddressSelect = 'default_address_select',
  DefaultStart = 'default_start',
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
  withFullAddress?: boolean;
  place: SearchAddressFromAPI;
  style?: StyleProp<ViewStyle>;
  addressTextStyle?: StyleProp<TextStyle>;
  addressesTextNumberOfLines?: number;
};
