import React from 'react';
import { getLocales } from 'react-native-localize';
import {
  DriverArrivedAlert,
  FreeTimeAlert,
  InternetDisconnectedAlert,
  PaidTimeAlert,
  PlannedTripAlert,
} from 'shuttlex-integration';

import { useAppDispatch } from '../core/redux/hooks';
import { removeAlert } from '../core/ride/redux/alerts';
import {
  AlertType,
  FreeTimeAlertOptions,
  PaidTimeAlertOptions,
  PlannedTripAlertOptions,
} from '../core/ride/redux/alerts/types';

const AlertInitializer = ({ id, type, options }: Omit<AlertType, 'options'> & { options?: object }): JSX.Element => {
  const dispatch = useAppDispatch();

  const locale = getLocales()[0].languageTag;

  const removeThisAlert = () => dispatch(removeAlert({ id }));

  switch (type) {
    case 'free_time_ends': {
      const typedOptions = options as FreeTimeAlertOptions;
      return <FreeTimeAlert onClose={removeThisAlert} closeTimeout={10000} {...typedOptions} />;
    }
    case 'paid_time_starts': {
      const typedOptions = options as PaidTimeAlertOptions;
      return <PaidTimeAlert onClose={removeThisAlert} closeTimeout={10000} {...typedOptions} />;
    }
    case 'planned_trip': {
      const typedOptions = options as PlannedTripAlertOptions;
      return (
        <PlannedTripAlert
          locale={locale}
          date={new Date(typedOptions.date)}
          onClose={removeThisAlert}
          onCancelPress={removeThisAlert}
        />
      );
    }
    case 'driver_arrived': {
      return <DriverArrivedAlert onClose={removeThisAlert} closeTimeout={10000} />;
    }
    case 'internet_disconnected': {
      return <InternetDisconnectedAlert isClosable={false} />;
    }
  }
};

export default AlertInitializer;
