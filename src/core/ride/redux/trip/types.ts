export type ContractorInfo = {
  name: string;
  car: {
    model: string;
    plateNumber: string;
  };
};

export enum TripStatus {
  Idle = 'idle',
  Arrived = 'arrived',
  Ride = 'ride',
}

export type TripState = {
  contractor: ContractorInfo | null;
  status: TripStatus;
};
