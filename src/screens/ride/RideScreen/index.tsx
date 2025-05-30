import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { IS_ANDROID, MenuHeader, sizes, useTheme } from 'shuttlex-integration';

import { lotteryWinnerSelector } from '../../../core/lottery/redux/selectors';
import {
  getCurrentActiveLottery,
  getCurrentPrizes,
  getCurrentUpcomingLottery,
  getPreviousLottery,
} from '../../../core/lottery/redux/thunks';
import { useMap } from '../../../core/map/mapContext.tsx';
import { getAccountSettingsVerifyStatus } from '../../../core/menu/redux/accountSettings/thunks';
import { setIsLoadingStubVisible } from '../../../core/passenger/redux';
import { useAppDispatch } from '../../../core/redux/hooks';
import { useGeolocationStartWatch, useNetworkConnectionStartWatch } from '../../../core/ride/hooks';
import { isTooManyRidesPopupVisibleSelector } from '../../../core/ride/redux/offer/selectors';
import { orderStatusSelector } from '../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { setIsOrderCanceledAlertVisible } from '../../../core/ride/redux/trip';
import { isOrderCanceledAlertVisibleSelector, orderSelector } from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import { RootStackParamList } from '../../../Navigate/props.ts';
import Menu from '../Menu';
import MapView from './MapView';
import Order from './Order';
import TooManyRidesPopup from './Order/popups/TooManyRidesPopup';
import { OrderRef } from './Order/types';
import WinningPopup from './popups/WinningPopup';
import Trip from './Trip';
import { RideScreenProps } from './types';

const RideScreen = ({ route }: RideScreenProps): JSX.Element => {
  const mapMarkerCoordinates = route.params?.mapMarkerCoordinates;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { colors } = useTheme();
  const { t } = useTranslation();
  const orderRef = useRef<OrderRef>(null);
  const dispatch = useAppDispatch();
  const { mapRef } = useMap();

  const orderStatus = useSelector(orderStatusSelector);
  const lotteryWinner = useSelector(lotteryWinnerSelector);
  const isTooManyRidesPopupVisible = useSelector(isTooManyRidesPopupVisibleSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isWinningPopupVisible, setIsWinningPopupVisible] = useState(false);

  //TODO: uncomment when we will need MysteryBoxPopup
  // const [isMysteryBoxPopupVisible, setIsMysteryBoxPopupVisible] = useState(false);

  const orderInfo = useSelector(orderSelector);
  const isOrderCanceledAlertVisible = useSelector(isOrderCanceledAlertVisibleSelector);

  useEffect(() => {
    if (mapMarkerCoordinates) {
      mapRef.current?.animateCamera(
        {
          pitch: 0,
          heading: 0,
          center: { latitude: mapMarkerCoordinates.latitude, longitude: mapMarkerCoordinates.longitude },
          zoom: 16,
        },
        { duration: 1500 },
      );

      navigation.setParams({ mapMarkerCoordinates: undefined });
    }
  }, [mapRef, navigation, mapMarkerCoordinates]);

  useEffect(() => {
    if (lotteryWinner?.ticket.length !== 0) {
      setIsWinningPopupVisible(true);
    }
  }, [lotteryWinner]);

  useEffect(() => {
    dispatch(getAccountSettingsVerifyStatus());
  }, [dispatch]);

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
      paddingTop: IS_ANDROID ? androidPaddingTop : 8,
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
      <SafeAreaView style={styles.wrapper}>
        <MapView onFirstCameraAnimationComplete={() => dispatch(setIsLoadingStubVisible(false))} />
        {topMenu[orderStatus]}
        {TripStatus.Accepted && orderInfo ? <Trip /> : <Order ref={orderRef} />}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} isStatusBarTranslucent />}
      {isWinningPopupVisible && <WinningPopup setIsWinningPopupVisible={setIsWinningPopupVisible} />}
      {/*TODO: uncomment when we will need MysteryBoxPopup*/}
      {/*{isMysteryBoxPopupVisible && <MysteryBoxPopup setIsMysteryBoxPopupVisible={setIsMysteryBoxPopupVisible} />}*/}
      {isTooManyRidesPopupVisible && <TooManyRidesPopup />}
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
