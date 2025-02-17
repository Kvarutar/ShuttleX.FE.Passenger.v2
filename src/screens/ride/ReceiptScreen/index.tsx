import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCurrencySign, ReceiptScreen as ReceiptScreenLayout } from 'shuttlex-integration';
import { CurrencyType } from 'shuttlex-integration/lib/typescript/src/utils/currency/types';

import { lotteryTicketAfterRideSelector } from '../../../core/lottery/redux/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { cleanOrder } from '../../../core/ride/redux/order';
import { endTrip, setIsOrderCanceled, setTripReceipt, setTripRouteInfo } from '../../../core/ride/redux/trip';
import {
  isTripCanceledSelector,
  orderSelector,
  tripDropOffRouteSelector,
  tripReceiptSelector,
} from '../../../core/ride/redux/trip/selectors';
import { RootStackParamList } from '../../../Navigate/props';

const ReceiptScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Receipt'>>();
  const dispatch = useAppDispatch();

  const routeInfo = useSelector(tripDropOffRouteSelector);
  const orderInfo = useSelector(orderSelector);
  const receipt = useSelector(tripReceiptSelector);
  const isTripCanceled = useSelector(isTripCanceledSelector);
  const ticket = useSelector(lotteryTicketAfterRideSelector);

  useEffect(() => {
    if (orderInfo && routeInfo) {
      dispatch(setTripReceipt({ orderInfo, routeInfo }));
      dispatch(cleanOrder());
      dispatch(setTripRouteInfo(null));
    }
  }, [dispatch, orderInfo, routeInfo]);

  const onEndTrip = async () => {
    dispatch(setTripReceipt(null));
    dispatch(endTrip());
    //Because this state sometimes changes before we end up to this screen, here it's cleaning
    //TODO: Think about cleaner way
    dispatch(setIsOrderCanceled(false));

    navigation.navigate('Ride');
  };

  if (!receipt?.orderInfo.info || !receipt.routeInfo) {
    return <></>;
  }

  return (
    <ReceiptScreenLayout
      pickUpDate={receipt.orderInfo.info.pickUpDate}
      finishedDate={receipt.orderInfo.info.finishedDate}
      onClose={onEndTrip}
      totalDistanceMtr={receipt.routeInfo.totalDistanceMtr}
      pickUpAddress={receipt.orderInfo.info.pickUpFullAddress}
      dropOffAddress={receipt.orderInfo.info.dropOffFullAddress}
      tripPrice={`${getCurrencySign(receipt.orderInfo.info.currencyCode as CurrencyType)}${receipt.orderInfo.info.totalFinalPrice ?? receipt.orderInfo.info.estimatedPrice}`}
      startPoint={receipt.routeInfo.waypoints[0].geo}
      endPoint={receipt.routeInfo.waypoints[receipt.routeInfo.waypoints.length - 1].geo}
      isTripCanceled={isTripCanceled}
      ticket={ticket?.ticketNumber}
      geometries={receipt.routeInfo.legs.map(leg => leg.geometry)}
    />
  );
};

export default ReceiptScreen;
