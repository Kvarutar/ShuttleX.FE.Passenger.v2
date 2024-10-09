import { StyleProp, ViewStyle } from 'react-native';

export enum PlaceBarModes {
  Default = 'default',
  Search = 'search',
  Save = 'save',
}

export type PlaceType = {
  address: string;
  details?: string;
  distance?: string;
};

export type PlaceBarProps = {
  mode?: PlaceBarModes;
  place: PlaceType;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export type PlaceTitleProps = {
  withDistance?: boolean;
  place: PlaceType;
  style?: StyleProp<ViewStyle>;
};
