import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { BarModes, TariffType } from 'shuttlex-integration';

export type TariffGroupName = 'Economy' | 'Exclusive' | 'Business';

export type TariffGroupProps = {
  price: string;
  title: TariffGroupName;
  mode?: BarModes;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  isAvailableTariffGroup: boolean;
};

type PlanButton = {
  time: string;
  price: string;
};

export type PlanButtonProps = PlanButton & {
  onPress: (event: GestureResponderEvent) => void;
  selectedPrice: boolean;
  index: number;
};

export type TariffBarType = {
  tariff: TariffType;
  info: {
    capacity: string;
    baggage: string;
    isAvailable: boolean;
  };
  plans: PlanButton[];
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
