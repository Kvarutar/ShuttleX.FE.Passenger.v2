import { TariffType } from 'shuttlex-integration';

export enum OrderStatus {
  StartRide = 'startRide',
  ChoosingTariff = 'choosingTariff',
  Confirming = 'confirming',
  Confirmation = 'confirmation',
  NoDrivers = 'noDrivers',
  RideUnavaliable = 'rideUnavaliable',
}

export type Point = {
  id: number;
  address: string;
};

export type OrderState = {
  status: OrderStatus;
  tripTariff: TariffType | null;
  points: Point[];
};
