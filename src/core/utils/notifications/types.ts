export interface NotificationRemoteMessage {
  notification: {
    title: string;
    body: string;
  };
  data: {
    sendTime: string;
    key: string;
    payload: string;
  };
}

export enum SSEAndNotificationsEventType {
  DriverAccepted = 'driver_accepted',
  TripStarted = 'trip_started',
  TripEnded = 'trip_ended',
  DriverArrived = 'driver_arrived',
  DriverArrivedToStopPoint = 'driver_arrived_to_stop_point',
  PickUpOnStopPoint = 'pick_up_on_stop_point',
  DriverRejected = 'driver_rejected',
  WinnerFounded = 'winner_found',
  DriverCanceled = 'driver_canceled',
  Custom = 'user_custom_notification',
  PaymentTracsactionStatus = 'passenger_payment_transaction_status',
}

export type NotificationPayload = {
  orderId?: string;
  prizeIds?: string[];
  ticketNumber?: string;
  paymentTransactionId?: string;
  status?: string;
  errorMessage?: string;
};
