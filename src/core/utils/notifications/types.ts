export interface NotificationRemoteMessage {
  data: {
    title: string;
    body: string;
    sendTime: string;
    key: string;
    payload: string;
  };
}

export enum NotificationType {
  DriverAccepted = 'driver_accepted',
  TripStarted = 'trip_started',
  TripEnded = 'trip_ended',
  DriverArrived = 'driver_arrived',
  DriverRejected = 'driver_rejected',
  WinnerFounded = 'winner_found',
  DriverCanceled = 'driver_canceled',
}

export type NotificationPayload = {
  orderId?: string;
  prizeIds?: string[];
  ticketNumber?: string;
};
