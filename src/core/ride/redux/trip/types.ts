import { TariffType } from 'shuttlex-integration';

export type ContractorInfo = {
  name: string;
  car: {
    model: string;
    plateNumber: string;
  };
  phone: string;
};

export enum TripStatus {
  Idle = 'idle',
  Arrived = 'arrived',
  Ride = 'ride',
}

export type TripOrder = {
  contractor: ContractorInfo;
  tripType: TariffType;
  total: string;
};

export type TripState = {
  order: TripOrder | null;
  status: TripStatus;
};
