import { TariffType } from 'shuttlex-integration';

import { AddressPoint } from '../order/types';

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
  route: {
    startPoint: AddressPoint;
    endPoints: AddressPoint[];
  };
};

export type TripState = {
  tripInfo: TripInfo | null;
  status: TripStatus;
  tip: number | null;
};
