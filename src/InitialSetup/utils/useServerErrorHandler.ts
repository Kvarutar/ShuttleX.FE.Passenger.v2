import { useSelector } from 'react-redux';
import { isServerError } from 'shuttlex-integration';

import { authErrorSelector } from '../../core/auth/redux/selectors';
import {
  isCantDeleteAccountWhileInDebtError,
  isInvalidStateForAccountDeletingError,
} from '../../core/menu/redux/accountSettings/errors';
import {
  accountSettingsChangeDataErrorSelector,
  deleteAccountErrorSelector,
} from '../../core/menu/redux/accountSettings/selectors';
import {
  isRouteLengthTooShortError,
  isRoutePointsLocationError,
  isTooManyActiveRidesError,
} from '../../core/ride/redux/offer/errors';
import {
  offerCreateErrorSelector,
  offerRoutesErrorSelector,
  tariffsPricesErrorSelector,
} from '../../core/ride/redux/offer/selectors';
import { orderInfoErrorSelector } from '../../core/ride/redux/trip/selectors';

const useServerErrorHandler = () => {
  const errors = [
    useSelector(offerRoutesErrorSelector),
    useSelector(deleteAccountErrorSelector),
    useSelector(offerCreateErrorSelector),
    useSelector(authErrorSelector),
    useSelector(tariffsPricesErrorSelector),
    useSelector(accountSettingsChangeDataErrorSelector),
    useSelector(orderInfoErrorSelector),
  ];

  const serverError = errors.find((error, index) => {
    if (error) {
      switch (index) {
        // if error from offerRoutesErrorSelector
        case 0:
          return !isRoutePointsLocationError(error) && !isRouteLengthTooShortError(error) && isServerError(error);
        // if error from deleteAccountError
        case 1:
          return (
            !isCantDeleteAccountWhileInDebtError(error) &&
            !isInvalidStateForAccountDeletingError(error) &&
            isServerError(error)
          );
        // if error from offerCreateErrorSelector
        case 2:
          return !isTooManyActiveRidesError && isServerError(error);
        default:
          return isServerError(error);
      }
    }
  });

  //TODO: change return value, when we can get code from error
  return {
    isErrorAvailable: serverError !== undefined,
  };
};

export default useServerErrorHandler;
