export enum OrderStatus {
  StartRide = 'startRide',
  ChoosingTariff = 'choosingTariff',
  Payment = 'payment',
  Confirming = 'confirming',
  NoDrivers = 'noDrivers',
  RideUnavailable = 'rideUnavailable',
}

export type OrderState = {
  status: OrderStatus;
  isLoading: boolean;
};
