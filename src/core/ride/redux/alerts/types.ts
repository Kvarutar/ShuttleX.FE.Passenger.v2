import { PaidTimeAlertProps, PlannedTripAlertProps } from 'shuttlex-integration';

export enum AlertPriority {
  Low = 0,
  High = 1,
  System = 2,
}

export type AlertData = {
  id: string;
  priority: AlertPriority;
};

export type PaidTimeAlertOptions = PaidTimeAlertProps;
export type PlannedTripAlertOptions = Omit<PlannedTripAlertProps, 'date' | 'locale' | 'onCancelPress'> & {
  date: string;
};

type AlertTypes =
  | { type: 'paid_time_starts'; options: PaidTimeAlertOptions }
  | { type: 'planned_trip'; options: PlannedTripAlertOptions }
  | { type: 'driver_arrived' }
  | { type: 'internet_disconnected' };

export type AlertType = AlertData & AlertTypes;
export type AlertTypeWithOptionalId = Omit<AlertData, 'id'> & { id?: AlertData['id'] } & AlertTypes;

export type AlertsState = {
  list: AlertType[];
};
