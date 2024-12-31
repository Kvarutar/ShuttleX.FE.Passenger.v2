import { ImageStyle, StyleProp, ViewStyle } from 'react-native';

import { Prize } from '../../../../core/lottery/redux/types';

export type PrizePodiumProps = {
  prizes: Prize[];
  handleSurprisesPress: (prize: Prize) => void;
};

export type PrizeBoxProps = {
  prize: Prize;
  onPress: () => void;
};

export type prizeBoxPropertiesType = {
  userImage: StyleProp<ImageStyle>;
  container: StyleProp<ViewStyle>;
};
