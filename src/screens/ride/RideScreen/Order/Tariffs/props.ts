import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { BarModes, TariffType } from 'shuttlex-integration';

export type TariffGroupProps = {
  price: string;
  title: string;
  mode?: BarModes;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
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
  };
  plans: PlanButton[];
};

export type TariffBarProps = TariffBarType & {
  onPress: (event: GestureResponderEvent) => void;
  selectedPlan: boolean;
  selectedGroup: string;
  windowIsOpened: boolean;
};

export type TariffsProps = {
  setIsAddressSelectVisible: (state: boolean) => void;
};
