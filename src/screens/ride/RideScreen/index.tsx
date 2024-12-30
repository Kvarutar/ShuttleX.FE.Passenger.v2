import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { MenuHeader, sizes, useTheme } from 'shuttlex-integration';

import { lotteryWinnerSelector } from '../../../core/lottery/redux/selectors';
import {
  getCurrentActiveLottery,
  getCurrentPrizes,
  getCurrentUpcomingLottery,
  getPreviousLottery,
} from '../../../core/lottery/redux/thunks';
import { getAccountSettingsVerifyStatus } from '../../../core/menu/redux/accountSettings/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { useGeolocationStartWatch, useNetworkConnectionStartWatch } from '../../../core/ride/hooks';
import { offerIdSelector } from '../../../core/ride/redux/offer/selectors';
import { orderStatusSelector } from '../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { setIsOrderCanceledAlertVisible } from '../../../core/ride/redux/trip';
import {
  isOrderCanceledAlertVisibleSelector,
  orderIdSelector,
  orderSelector,
} from '../../../core/ride/redux/trip/selectors';
import {
  getArrivedLongPolling,
  getInPickUpLongPolling,
  getOrderLongPolling,
  getTripCanceledBeforePickUpLongPolling,
} from '../../../core/ride/redux/trip/thunks';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import Menu from '../Menu';
import Loading from './Loading';
import MapView from './MapView';
import Order from './Order';
import { OrderRef } from './Order/types';
import WinningPopup from './popups/WinningPopup';
import Trip from './Trip';
import { RideScreenProps } from './types';

const RideScreen = ({ route }: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const orderRef = useRef<OrderRef>(null);
  const dispatch = useAppDispatch();

  const orderStatus = useSelector(orderStatusSelector);
  const lotteryWinner = useSelector(lotteryWinnerSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isWinningPopupVisible, setIsWinningPopupVisible] = useState(false);

  //TODO: uncomment when we will need MysteryBoxPopup
  // const [isMysteryBoxPopupVisible, setIsMysteryBoxPopupVisible] = useState(false);

  const orderInfo = useSelector(orderSelector);
  const orderId = useSelector(orderIdSelector);
  const offerId = useSelector(offerIdSelector);
  const isOrderCanceledAlertVisible = useSelector(isOrderCanceledAlertVisibleSelector);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (offerId && orderStatus === OrderStatus.Confirming) {
      dispatch(getOrderLongPolling(offerId));
    }
  }, [dispatch, offerId, orderStatus]);

  useEffect(() => {
    if (lotteryWinner?.ticket.length !== 0) {
      setIsWinningPopupVisible(true);
    }
  }, [lotteryWinner]);

  useEffect(() => {
    dispatch(getAccountSettingsVerifyStatus());
  }, [dispatch]);

  useEffect(() => {
    if (orderId) {
      dispatch(getTripCanceledBeforePickUpLongPolling(orderId));
      dispatch(getArrivedLongPolling(orderId));
      dispatch(getInPickUpLongPolling(orderId));
      dispatch(getArrivedLongPolling(orderId));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    (async () => {
      const activeLottery = await dispatch(getCurrentActiveLottery()).unwrap();

      if (activeLottery === null) {
        dispatch(getCurrentUpcomingLottery());
      }
      dispatch(getPreviousLottery());
      dispatch(getCurrentPrizes());
    })();
  }, [dispatch]);

  //TEST driver rejected push
  // useEffect(() => {
  //   console.log(orderStatus)
  //   setInterval(()=>{
  //     dispatch(setOrderStatus(OrderStatus.Confirming))
  //   }, 20000)
  // }, [orderStatus])

  //for test
  useEffect(() => {
    if (route.params?.openAddressSelect) {
      orderRef.current?.openAddressSelect();
    }
  }, [route.params?.openAddressSelect, route]);

  //TODO: uncomment when we will need MysteryBoxPopup
  // useEffect(() => {
  //   if (orderInfo) {
  //     setTimeout(() => {
  //       setIsMysteryBoxPopupVisible(true);
  //     }, 2000);
  //   }
  // }, [orderInfo]);

  useGeolocationStartWatch();
  useNetworkConnectionStartWatch();

  const androidPaddingTop = StatusBar.currentHeight
    ? StatusBar.currentHeight.valueOf() + sizes.paddingHorizontal
    : sizes.paddingHorizontal;

  const computedStyles = StyleSheet.create({
    menuStyle: {
      paddingTop: Platform.OS === 'android' ? androidPaddingTop : 8,
      zIndex: orderStatus === OrderStatus.Confirming ? 1 : 0,
    },
    unreadNotificationsMarker: {
      backgroundColor: colors.primaryColor,
    },
    unreadNotificationsText: {
      color: colors.textSecondaryColor,
    },
  });

  // //TODO uncoment when we need this
  // let unreadNotificationsMarker: ReactNode = null;

  // if (unreadNotifications > 0) {
  //   unreadNotificationsMarker = (
  //     <View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>
  //       <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>
  //         {unreadNotifications}
  //       </Text>
  //     </View>
  //   );
  // } else if (unreadNotifications > 99) {
  //   unreadNotificationsMarker = (
  //     <View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>
  //       <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>99+</Text>
  //     </View>
  //   );
  // }

  const topMenuHeader = () => (
    <MenuHeader onMenuPress={() => setIsMenuVisible(true)} style={[styles.menuStyle, computedStyles.menuStyle]} />
  );

  const topMenu: Record<OrderStatus, ReactNode | null> = {
    startRide: topMenuHeader(),
    choosingTariff: topMenuHeader(),
    payment: topMenuHeader(),
    confirming: topMenuHeader(),
    noDrivers: null,
    rideUnavailable: null,
  };

  //TODO: Remove these popup and effect when add saving pick up and drop off points data in device's storage
  useEffect(() => {
    if (isOrderCanceledAlertVisible) {
      Alert.alert(t('ride_Ride_canceledOrderAlertTitle'), t('ride_Ride_canceledOrderAlertDescription'), [
        {
          text: t('ride_Ride_canceledOrderAlertButton'),
          onPress: () => dispatch(setIsOrderCanceledAlertVisible(false)),
        },
      ]);
    }
  }, [t, dispatch, isOrderCanceledAlertVisible]);

  return (
    <>
      {isLoading && <Loading />}
      <SafeAreaView style={styles.wrapper}>
        <MapView onFirstCameraAnimationComplete={() => setIsLoading(false)} />
        {topMenu[orderStatus]}
        {TripStatus.Accepted && orderInfo ? <Trip /> : <Order ref={orderRef} />}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} isStatusBarTranslucent />}
      {isWinningPopupVisible && <WinningPopup setIsWinningPopupVisible={setIsWinningPopupVisible} />}
      {/*TODO: uncomment when we will need MysteryBoxPopup*/}
      {/*{isMysteryBoxPopupVisible && <MysteryBoxPopup setIsMysteryBoxPopupVisible={setIsMysteryBoxPopupVisible} />}*/}
    </>
  );
};

const styles = StyleSheet.create({
  unreadNotificationsMarker: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  unreadNotificationsText: {
    fontFamily: 'Inter Medium',
    fontSize: 9,
  },
  wrapper: {
    flex: 1,
  },
  button: {
    overflow: 'visible',
  },
  menuStyle: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
});

export default RideScreen;
