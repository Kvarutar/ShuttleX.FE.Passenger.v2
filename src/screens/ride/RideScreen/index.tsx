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
  useThemeV1,
} from 'shuttlex-integration';

import { setNotificationList } from '../../../core/menu/redux/notifications';
import { numberOfUnreadNotificationsSelector } from '../../../core/menu/redux/notifications/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { setProfile } from '../../../core/redux/passenger';
import { useGeolocationStartWatch, useNetworkConnectionStartWatch } from '../../../core/ride/hooks';
import { orderStatusSelector } from '../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { tripInfoSelector, tripStatusSelector } from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import Menu from '../Menu';
import MapCameraModeButton from './MapCameraModeButton';
import MapView from './MapView';
import Order from './Order';
import { OrderRef } from './Order/types';
import PassengerTimer from './PassengerTimer';
import { RideScreenProps } from './props';
import Trip from './Trip';

const RideScreen = ({ navigation, route }: RideScreenProps): JSX.Element => {
  const { colors } = useThemeV1();
  const dispatch = useAppDispatch();
  const orderRef = useRef<OrderRef>(null);

  const tripStatus = useSelector(tripStatusSelector);
  const tripInfo = useSelector(tripInfoSelector);
  const orderStatus = useSelector(orderStatusSelector);
  const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);
  const [contractorInfoTest, setContractorInfoTest] = useState(false); //for test
  const [isPassengerLate, setIsPassengerLate] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  //for test
  useEffect(() => {
    if (route.params?.openAddressSelect) {
      orderRef.current?.openAddressSelect();
    }
  }, [route.params?.openAddressSelect, route]);

  //for test
  useEffect(() => {
    if (orderStatus === OrderStatus.Confirmation) {
      setTimeout(() => {
        setContractorInfoTest(true);
      }, 10000);
    }
  }, [orderStatus]);

  useEffect(() => {
    dispatch(
      setProfile({
        fullName: 'John',
        email: '',
        phone: '',
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

  useGeolocationStartWatch();
  useNetworkConnectionStartWatch();

  const computedStyles = StyleSheet.create({
    topButtonsContainer: {
      paddingTop: Platform.OS === 'android' ? sizes.paddingVertical : 0,
      zIndex: orderStatus === OrderStatus.Confirmation ? 1 : 0,
    },
    unreadNotificationsMarker: {
      backgroundColor: colors.primaryColor,
    },
    unreadNotificationsText: {
      color: colors.backgroundPrimaryColor,
    },
  });

  let unreadNotificationsMarker = null;
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

  const topFullButtons = (
    <>
      <Button
        circleSubContainerStyle={styles.buttonContainer}
        shape={ButtonShapes.Circle}
        mode={CircleButtonModes.Mode2}
        onPress={() => setIsMenuVisible(true)}
      >
        <MenuIcon />
      </Button>
      {orderStatus !== OrderStatus.Confirmation && (
        <View style={styles.topRightButtonContainer}>
          <Button
            circleSubContainerStyle={styles.buttonContainer}
            style={styles.button}
            shape={ButtonShapes.Circle}
            mode={CircleButtonModes.Mode2}
            onPress={() => navigation.navigate('Notifications')}
          >
            <NotificationIcon />
            {unreadNotificationsMarker}
          </Button>
          {tripInfo && tripStatus === TripStatus.Arrived && (
            <PassengerTimer isPassengerLate={isPassengerLate} setIsPassengerLate={() => setIsPassengerLate(true)} />
          )}
        </View>
      )}
    </>
  );

  const topButtons: Record<OrderStatus, ReactNode | null> = {
    startRide: topFullButtons,
    rideUnavaliable: topFullButtons,
    noDrivers: topFullButtons,
    choosingTariff: topFullButtons,
    confirming: null,
    confirmation: null,
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <MapView />
        <View style={[styles.topButtonsContainer, computedStyles.topButtonsContainer]}>{topButtons[orderStatus]}</View>
        {contractorInfoTest ? (
          <>
            <MapCameraModeButton />
            <Trip />
          </>
        ) : (
          <Order navigation={navigation} ref={orderRef} />
        )}
        {orderStatus === OrderStatus.Confirmation && <Fog />}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
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
  buttonContainer: {
    borderWidth: 0,
  },
});

export default RideScreen;
