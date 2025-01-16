import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { CurrencyType } from 'shuttlex-integration/lib/typescript/src/utils/currency/types';

import { TariffsType, TariffWithMatching } from '../../../../../core/ride/redux/offer/types';

export type TariffGroupProps = {
  currencyCode: CurrencyType;
  price: number;
  title: TariffsType;
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  carsAnimationDelayInMilSec: number;
};

export type TariffBarProps = { tariff: TariffWithMatching } & {
  onPress: (event: GestureResponderEvent) => void;
  isPlanSelected: boolean;
  selectedPrice: number | null;
  setSelectedPrice: (newState: number | null) => void;
  windowIsOpened: boolean;
  carsAnimationDelayInMilSec: number;
  withAnimatedBigCars: boolean;
};

export type TariffGroupType = {
  name: TariffsType;
  tariffs: TariffWithMatching[];
};
