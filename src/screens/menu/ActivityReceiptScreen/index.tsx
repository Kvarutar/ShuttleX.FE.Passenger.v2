import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import {
  getCurrencySign,
  LoadingSpinner,
  LoadingSpinnerIconModes,
  ReceiptScreen as ReceiptScreenLayout,
} from 'shuttlex-integration';
import { CurrencyType } from 'shuttlex-integration/lib/typescript/src/utils/currency/types';

import {
  isTicketAfterRideLoadingSelector,
  lotteryTicketAfterRideSelector,
} from '../../../core/lottery/redux/selectors';
import { ordersHistorySelector } from '../../../core/passenger/redux/selectors';
import { isRouteInfoLoadingSelector, tripDropOffRouteSelector } from '../../../core/ride/redux/trip/selectors';
import { RootStackParamList } from '../../../Navigate/props';

const ActivityReceiptScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ActivityReceiptScreen'>>();

  const ordersHistory = useSelector(ordersHistorySelector);
  const routeInfo = useSelector(tripDropOffRouteSelector);
  const ticket = useSelector(lotteryTicketAfterRideSelector);

  const isRouteInfoLoading = useSelector(isRouteInfoLoadingSelector);
  const isTicketAfterRideLoading = useSelector(isTicketAfterRideLoadingSelector);

  const orderInfo = ordersHistory.find(order => order.orderId === route.params.orderId);

  if (isRouteInfoLoading || isTicketAfterRideLoading || !orderInfo || !routeInfo) {
    return <LoadingSpinner iconMode={LoadingSpinnerIconModes.Large} />;
  }

  const isOrderCanceled = orderInfo.state === 'CanceledByContractor' || orderInfo.state === 'CanceledByPassenger';

  return (
    <ReceiptScreenLayout
      contractorName={orderInfo.firstName}
      carNumber={orderInfo.carNumber}
      pickUpDate={orderInfo.pickUpDate}
      finishedDate={orderInfo.finishedDate}
      onClose={navigation.goBack}
      tripPrice={`${getCurrencySign(orderInfo.currencyCode as CurrencyType)}${orderInfo.totalFinalPrice ?? orderInfo.estimatedPrice}`}
      totalDistanceMtr={routeInfo.totalDistanceMtr}
      pickUpAddress={orderInfo.pickUpFullAddress}
      dropOffAddress={orderInfo.dropOffFullAddress}
      startPoint={routeInfo.waypoints[0].geo}
      endPoint={routeInfo.waypoints[routeInfo.waypoints.length - 1].geo}
      isTripCanceled={isOrderCanceled}
      ticket={ticket?.ticketNumber}
      geometry={routeInfo.geometry}
    />
  );
};

export default ActivityReceiptScreen;
