export interface RemoteMessage {
  data: {
    title: string;
    body: string;
    key: string;
    payload: string;
  };
}

export enum NotificationType {
  DriverAccepted = 'driver_accepted',
  NoAvailableDrivers = 'no_available_drivers',
  TripStarted = 'trip_started',
  TripEnded = 'trip_ended',
  DriverArrived = 'driver_arrived',
  DriverRejected = 'driver_rejected',
  WinnerFounded = 'winner_founded',
}

export type NotificationPayload = {
  orderId?: string;
  prizeId?: string;
};

export type NotificationWithPayload = NotificationType.DriverAccepted | NotificationType.WinnerFounded;
