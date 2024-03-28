import { TariffType } from 'shuttlex-integration';

export type ContractorInfo = {
  name: string;
  car: {
    model: string;
    plateNumber: string;
  };
  phone: string;
  approximateArrival: number;
};

export enum TripStatus {
  Idle = 'idle',
  Arrived = 'arrived',
  Ride = 'ride',
}

export type TripInfo = {
  contractor: ContractorInfo;
  tripType: TariffType;
  total: string;
};

export type TripState = {
  tripInfo: TripInfo | null;
  status: TripStatus;
};
