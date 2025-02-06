import { TripStateFromAPI, TripStatus } from '../types';

export const getFETripStatusByBETripState = (tripState: TripStateFromAPI | undefined) => {
  switch (tripState) {
    case 'InPreviousOrder':
      return TripStatus.Accepted;
    case 'MoveToPickUp':
      return TripStatus.Accepted;
    case 'InPickUp':
      return TripStatus.Arrived;
    case 'MoveToDropOff':
      return TripStatus.Ride;
    default:
      return TripStatus.Idle;
  }
};
