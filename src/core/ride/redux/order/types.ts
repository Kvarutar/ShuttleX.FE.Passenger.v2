import { LatLng } from 'react-native-maps';
import { TariffType } from 'shuttlex-integration';

export enum OrderStatus {
  StartRide = 'startRide',
  ChoosingTariff = 'choosingTariff',
  Confirming = 'confirming',
  Confirmation = 'confirmation',
  NoDrivers = 'noDrivers',
  RideUnavaliable = 'rideUnavaliable',
}

export type AddressPoint = { id: number; address: string } & LatLng;

export type Address = AddressPoint & { details?: string };

export type OrderState = {
  status: OrderStatus;
  tripTariff: TariffType | null;
  points: AddressPoint[];
  isLoading: boolean;
};
