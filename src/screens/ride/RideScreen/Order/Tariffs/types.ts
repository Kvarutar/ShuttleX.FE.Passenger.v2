import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

import { TariffsType, TariffWithMatching } from '../../../../../core/ride/redux/offer/types';

export type TariffGroupProps = {
  price: string;
  title: TariffsType;
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  isAvailableTariffGroup: boolean;
};

export type TariffBarProps = { tariff: TariffWithMatching } & {
  onPress: (event: GestureResponderEvent) => void;
  isPlanSelected: boolean;
  selectedPrice: number | null;
  setSelectedPrice: (newState: number | null) => void;
  isAvailableTariff: boolean;
  windowIsOpened: boolean;
};

export type TariffGroupType = {
  name: TariffsType;
  tariffs: TariffWithMatching[];
};

export type TariffsProps = {
  setIsAddressSelectVisible: (state: boolean) => void;
};
