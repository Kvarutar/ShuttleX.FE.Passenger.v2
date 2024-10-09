import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { BarModes, TariffType } from 'shuttlex-integration';

import { Plan } from '../../PlanButton/props';

export type TariffGroupName = 'Economy' | 'Exclusive' | 'Business';

export type TariffGroupProps = {
  price: string;
  title: TariffGroupName;
  mode?: BarModes;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  isAvailableTariffGroup: boolean;
};

export type TariffBarType = {
  tariff: TariffType;
  info: {
    capacity: string;
    baggage: string;
    isAvailable: boolean;
  };
  plans: Plan[];
};

export type TariffBarProps = TariffBarType & {
  onPress: (event: GestureResponderEvent) => void;
  isPlanSelected: boolean;
  selectedPrice: number | null;
  setSelectedPrice: (newState: number | null) => void;
  isAvailableTariff: boolean;
  windowIsOpened: boolean;
};

export type TariffGroupType = {
  name: TariffGroupName;
  tariffs: TariffBarType[];
};

export type TariffsProps = {
  setIsAddressSelectVisible: (state: boolean) => void;
};
