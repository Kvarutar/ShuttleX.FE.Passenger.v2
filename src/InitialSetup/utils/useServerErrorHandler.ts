import { useSelector } from 'react-redux';
import { isServerError } from 'shuttlex-integration';

import { authErrorSelector } from '../../core/auth/redux/selectors';
import { accountSettingsChangeDataErrorSelector } from '../../core/menu/redux/accountSettings/selectors';
import { isRoutePointsLocationError } from '../../core/ride/redux/offer/errors';
import { offerRoutesErrorSelector, tariffsPricesErrorSelector } from '../../core/ride/redux/offer/selectors';
import { orderInfoErrorSelector } from '../../core/ride/redux/trip/selectors';

const useServerErrorHandler = () => {
  const errors = [
    useSelector(offerRoutesErrorSelector),
    useSelector(authErrorSelector),
    useSelector(tariffsPricesErrorSelector),
    useSelector(accountSettingsChangeDataErrorSelector),
    useSelector(orderInfoErrorSelector),
  ];

  const serverError = errors.find((error, index) => {
    if (error) {
      // if error from offerRoutesErrorSelector
      if (index === 0) {
        return !isRoutePointsLocationError(error) && isServerError(error);
      }
      return isServerError(error);
    }
  });

  //TODO: change return value, when we can get code from error
  return {
    isErrorAvailable: serverError !== undefined,
  };
};

export default useServerErrorHandler;
