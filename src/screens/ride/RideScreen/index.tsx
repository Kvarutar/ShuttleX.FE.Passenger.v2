import { ReactNode, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { MenuHeader, sizes, useTheme } from 'shuttlex-integration';

import {
  getCurrentActiveLottery,
  getCurrentUpcomingLottery,
  getPreviousLottery,
} from '../../../core/lottery/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { useGeolocationStartWatch, useNetworkConnectionStartWatch } from '../../../core/ride/hooks';
import { orderStatusSelector } from '../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { orderIdSelector, orderSelector } from '../../../core/ride/redux/trip/selectors';
import { getTripCanceledBeforePickUpLongPolling } from '../../../core/ride/redux/trip/thunks';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import Menu from '../Menu';
import MapView from './MapView';
import Order from './Order';
import { OrderRef } from './Order/types';
import WinningPopup from './popups/WinningPopup';
import Trip from './Trip';
import { RideScreenProps } from './types';

const RideScreen = ({ navigation, route }: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const orderRef = useRef<OrderRef>(null);
  const dispatch = useAppDispatch();

  const orderStatus = useSelector(orderStatusSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isWinningPopupVisible, setIsWinningPopupVisible] = useState(false);
  //TODO: uncomment when we will need MysteryBoxPopup
  // const [isMysteryBoxPopupVisible, setIsMysteryBoxPopupVisible] = useState(false);

  const orderInfo = useSelector(orderSelector);
  const orderId = useSelector(orderIdSelector);

  //for test
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsWinningPopupVisible(true);
  //   }, 2000);
  // }, []);

  useEffect(() => {
    //TODO get to know if this is the best place for this longpolling
    if (orderId) {
      dispatch(getTripCanceledBeforePickUpLongPolling(orderId));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    (async () => {
      const activeLottery = await dispatch(getCurrentActiveLottery()).unwrap();

      if (activeLottery === null) {
        dispatch(getCurrentUpcomingLottery());
      }
      dispatch(getPreviousLottery());
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

  const computedStyles = StyleSheet.create({
    menuStyle: {
      paddingTop: 8,
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
    <MenuHeader
      onMenuPress={() => setIsMenuVisible(true)}
      onNotificationPress={() => navigation.navigate('Notifications')}
      style={[styles.menuStyle, computedStyles.menuStyle]}
    />
  );

  const topMenu: Record<OrderStatus, ReactNode | null> = {
    startRide: topMenuHeader(),
    choosingTariff: topMenuHeader(),
    payment: topMenuHeader(),
    confirming: topMenuHeader(),
    noDrivers: null,
    rideUnavailable: null,
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <MapView />
        {topMenu[orderStatus]}
        {TripStatus.Accepted && orderInfo ? <Trip orderInfo={orderInfo} /> : <Order ref={orderRef} />}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
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
