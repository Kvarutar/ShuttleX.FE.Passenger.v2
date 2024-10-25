import { ReactNode, useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShapes,
  CircleButtonModes,
  Fog,
  MenuIcon,
  NotificationIcon,
  NotificationType,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { setNotificationList } from '../../../core/menu/redux/notifications';
import { numberOfUnreadNotificationsSelector } from '../../../core/menu/redux/notifications/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { setProfile } from '../../../core/redux/passenger';
import { useGeolocationStartWatch, useNetworkConnectionStartWatch } from '../../../core/ride/hooks';
import { setOrderStatus } from '../../../core/ride/redux/order';
import { orderStatusSelector } from '../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { setContractorInfo, setTripInfo } from '../../../core/ride/redux/trip';
import { contractorInfoSelector } from '../../../core/ride/redux/trip/selectors';
import Menu from '../Menu';
import MapView from './MapView';
import Order from './Order';
import { OrderRef } from './Order/types';
import MysteryBoxPopup from './popups/MysteryBoxPopup';
import Trip from './Trip';
import { RideScreenProps } from './types';

const RideScreen = ({ navigation, route }: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const orderRef = useRef<OrderRef>(null);

  const orderStatus = useSelector(orderStatusSelector);
  const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);
  const contractorInfo = useSelector(contractorInfoSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMysteryBoxPopupVisible, setIsMysteryBoxPopupVisible] = useState(false);

  //for test
  useEffect(() => {
    if (route.params?.openAddressSelect) {
      orderRef.current?.openAddressSelect();
    }
  }, [route.params?.openAddressSelect, route]);

  //for test
  useEffect(() => {
    if (orderStatus === OrderStatus.Confirming) {
      setTimeout(() => {
        dispatch(
          setContractorInfo({
            firstName: 'Slava',
            carModel: '6',
            carNumber: 'BH 4426 AO',
            // phone: '+380635009999',
            //TODO get to know how can we get the number
            arrivalTime: '2024-10-22T10:28:47.612Z',
            carBrand: 'Mazda',
            totalLikesCount: 2,
            totalRidesCount: 10,
            level: 5,
            avatarId: 'string',
            currencyCode: 'string',
          }),
        );
        dispatch(
          setTripInfo({
            tripType: 'Basic',
            total: '35',
            route: {
              startPoint: { id: 0, address: 'Test', latitude: 0, longitude: 0 },
              endPoints: [{ id: 1, address: 'Test2', latitude: 0, longitude: 0 }],
              info: {
                duration: 3600,
                distance: 5000,
                legs: [
                  {
                    steps: [
                      {
                        maneuver: {
                          type: '',
                          instruction: '',
                          location: { latitude: 0, longitude: 0 },
                        },
                        geometry: '',
                      },
                    ],
                  },
                ],
              },
            },
          }),
        );
        dispatch(setOrderStatus(OrderStatus.StartRide));
      }, 10000);
    }
  }, [dispatch, orderStatus]);

  useEffect(() => {
    dispatch(
      setProfile({
        fullName: 'John Smith',
        email: 'mail@mail.ua',
        phone: '+380(50)924-50-61',
        imageUri:
          'https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album',
      }),
    );

    dispatch(
      setNotificationList([
        {
          type: NotificationType.TripWasRated,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: true,
          time: '5m ago',
          image: {
            uri: 'https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album',
          },
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Rating increased',
          description: 'Your rating was increased to 4.6',
          isRead: false,
          time: '5m ago',
        },
        {
          type: NotificationType.PlannedTrip,
          title: 'Booked time',
          description: 'You have to make booked trip right now',
          isRead: true,
          time: '5m ago',
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: true,
          time: '5m ago',
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: false,
          time: '5m ago',
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: true,
          time: '5m ago',
        },
        {
          type: NotificationType.RatingIncreased,
          title: 'Jack Johnson',
          description: 'rated the trip with you',
          isRead: true,
          time: '5m ago',
        },
      ]),
    );
  }, [dispatch]);

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
    topButtonsContainer: {
      paddingTop: Platform.OS === 'android' ? sizes.paddingVertical : 0,
      zIndex: orderStatus === OrderStatus.Confirming ? 1 : 0,
    },
    unreadNotificationsMarker: {
      backgroundColor: colors.primaryColor,
    },
    unreadNotificationsText: {
      color: colors.textSecondaryColor,
    },
  });

  let unreadNotificationsMarker: ReactNode = null;

  if (unreadNotifications > 0) {
    unreadNotificationsMarker = (
      <View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>
        <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>
          {unreadNotifications}
        </Text>
      </View>
    );
  } else if (unreadNotifications > 99) {
    unreadNotificationsMarker = (
      <View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>
        <Text style={[styles.unreadNotificationsText, computedStyles.unreadNotificationsText]}>99+</Text>
      </View>
    );
  }

  const topFullButtons = ({ withNotifications = true }: { withNotifications?: boolean } = {}) => (
    <>
      <Button
        withBorder={false}
        shape={ButtonShapes.Circle}
        mode={CircleButtonModes.Mode2}
        onPress={() => setIsMenuVisible(true)}
      >
        <MenuIcon />
      </Button>
      {withNotifications && (
        <View style={styles.topRightButtonContainer}>
          <Button
            withBorder={false}
            style={styles.button}
            shape={ButtonShapes.Circle}
            mode={CircleButtonModes.Mode2}
            onPress={() => navigation.navigate('Notifications')}
          >
            <NotificationIcon />
            {unreadNotificationsMarker}
          </Button>
        </View>
      )}
    </>
  );

  const topButtons: Record<OrderStatus, ReactNode | null> = {
    startRide: topFullButtons(),
    choosingTariff: topFullButtons(),
    payment: topFullButtons(),
    confirming: topFullButtons({ withNotifications: false }),
    noDrivers: null,
    rideUnavailable: null,
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <MapView />
        <View style={[styles.topButtonsContainer, computedStyles.topButtonsContainer]}>{topButtons[orderStatus]}</View>
        {contractorInfo ? <Trip /> : <Order ref={orderRef} />}
        {orderStatus === OrderStatus.Confirming && <Fog />}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
      {isMysteryBoxPopupVisible && <MysteryBoxPopup setIsMysteryBoxPopupVisible={setIsMysteryBoxPopupVisible} />}
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
  topButtonsContainer: {
    paddingHorizontal: sizes.paddingHorizontal,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  topRightButtonContainer: {
    alignItems: 'center',
  },
  button: {
    overflow: 'visible',
  },
});

export default RideScreen;
