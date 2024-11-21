import { ReactNode, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { MenuHeader, sizes, useTheme } from 'shuttlex-integration';

import { useGeolocationStartWatch, useNetworkConnectionStartWatch } from '../../../core/ride/hooks';
import { orderStatusSelector } from '../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { contractorInfoSelector } from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import Menu from '../Menu';
import MapView from './MapView';
import Order from './Order';
import { OrderRef } from './Order/types';
import MysteryBoxPopup from './popups/MysteryBoxPopup';
import WinningPopup from './popups/WinningPopup';
import Trip from './Trip';
import { RideScreenProps } from './types';

const RideScreen = ({ navigation, route }: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const orderRef = useRef<OrderRef>(null);

  const orderStatus = useSelector(orderStatusSelector);
  //TODO uncomment when needed
  // const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMysteryBoxPopupVisible, setIsMysteryBoxPopupVisible] = useState(false);
  const [isWinningPopupVisible, setIsWinningPopupVisible] = useState(false);

  const contractorInfo = useSelector(contractorInfoSelector);

  //for test
  useEffect(() => {
    setTimeout(() => {
      setIsWinningPopupVisible(true);
    }, 2000);
  }, []);

  //TODO: uncomment data from BE will be correct
  // useEffect(() => {
  //   dispatch(getCurrentLottery());
  // }, [dispatch]);

  //for test
  useEffect(() => {
    if (route.params?.openAddressSelect) {
      orderRef.current?.openAddressSelect();
    }
  }, [route.params?.openAddressSelect, route]);

  // useEffect(() => {
  //   //TODO uncomment when we need this
  //   dispatch(
  //     setNotificationList([
  //       {
  //         type: NotificationType.TripWasRated,
  //         title: 'Jack Johnson',
  //         description: 'rated the trip with you',
  //         isRead: true,
  //         time: '5m ago',
  //         image: {
  //           uri: 'https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album',
  //         },
  //       },
  //       {
  //         type: NotificationType.RatingIncreased,
  //         title: 'Rating increased',
  //         description: 'Your rating was increased to 4.6',
  //         isRead: false,
  //         time: '5m ago',
  //       },
  //       {
  //         type: NotificationType.PlannedTrip,
  //         title: 'Booked time',
  //         description: 'You have to make booked trip right now',
  //         isRead: true,
  //         time: '5m ago',
  //       },
  //       {
  //         type: NotificationType.RatingIncreased,
  //         title: 'Jack Johnson',
  //         description: 'rated the trip with you',
  //         isRead: true,
  //         time: '5m ago',
  //       },
  //       {
  //         type: NotificationType.RatingIncreased,
  //         title: 'Jack Johnson',
  //         description: 'rated the trip with you',
  //         isRead: false,
  //         time: '5m ago',
  //       },
  //       {
  //         type: NotificationType.RatingIncreased,
  //         title: 'Jack Johnson',
  //         description: 'rated the trip with you',
  //         isRead: true,
  //         time: '5m ago',
  //       },
  //       {
  //         type: NotificationType.RatingIncreased,
  //         title: 'Jack Johnson',
  //         description: 'rated the trip with you',
  //         isRead: true,
  //         time: '5m ago',
  //       },
  //     ]),
  //   );
  // }, [dispatch]);

  useEffect(() => {
    if (contractorInfo) {
      setTimeout(() => {
        setIsMysteryBoxPopupVisible(true);
      }, 2000);
    }
  }, [contractorInfo]);

  useGeolocationStartWatch();
  useNetworkConnectionStartWatch();

  const computedStyles = StyleSheet.create({
    menuStyle: {
      //TODO big padding on a top for android
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
        {TripStatus.Accepted && contractorInfo?.info ? (
          <Trip contractorInfo={contractorInfo} />
        ) : (
          <Order ref={orderRef} />
        )}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
      {isMysteryBoxPopupVisible && <MysteryBoxPopup setIsMysteryBoxPopupVisible={setIsMysteryBoxPopupVisible} />}
      {isWinningPopupVisible && <WinningPopup setIsWinningPopupVisible={setIsWinningPopupVisible} />}
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
