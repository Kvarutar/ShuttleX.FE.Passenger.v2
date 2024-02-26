import { TariffType } from 'shuttlex-integration';

export enum OfferStatus {
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

export type OfferState = {
  status: OfferStatus;
  tripTariff: TariffType | null;
  points: Point[];
};
