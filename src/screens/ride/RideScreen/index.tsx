import React, { ReactNode, useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  MenuIcon,
  NotificationIcon,
  NotificationType,
  RoundButton,
  ShortArrowIcon,
  sizes,
  StopWatch,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { setNotificationList } from '../../../core/menu/redux/notifications';
import { numberOfUnreadNotificationsSelector } from '../../../core/menu/redux/notifications/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { setProfile } from '../../../core/redux/passenger';
import { useGeolocationStartWatch, useNetworkConnectionStartWatch } from '../../../core/ride/hooks';
import { setOrderStatus } from '../../../core/ride/redux/order';
import { OrderStatusSelector } from '../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { setTripStatus } from '../../../core/ride/redux/trip';
import { ContractorInfoSelector, TripStatusSelector } from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import Menu from '../Menu';
import MapCameraModeButton from './MapCameraModeButton';
import MapView from './MapView';
import Offer from './Offer';
import PassengerTimer from './PassengerTimer';
import { RideScreenProps } from './props';
import Trip from './Trip';

const RideScreen = ({ navigation }: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const tripStatus = useSelector(TripStatusSelector);
  const orderStatus = useSelector(OrderStatusSelector);
  const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);
  const contractorInfo = useSelector(ContractorInfoSelector);

  const [isPassengerLate, setIsPassengerLate] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    if (contractorInfo) {
      setTimeout(() => {
        dispatch(setTripStatus(TripStatus.Arrived)); //for test
      }, 6000);
    }
  }, [dispatch, contractorInfo]);

  useEffect(() => {
    dispatch(
      setProfile({
        name: 'John',
        surname: 'Johnson',
        imageUri:
          'https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
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

  let stopWatch = null;

  if (contractorInfo && tripStatus === TripStatus.Idle) {
    console.log(new Date(+contractorInfo.approximateArrival));
    stopWatch = (
      <StopWatch
        initialDate={new Date(contractorInfo.approximateArrival)}
        mask="{m}m"
        onAfterCountdownEnds={() => {}}
      />
    );
  }

  const topFullButtons = (
    <>
      <RoundButton onPress={() => setIsMenuVisible(true)}>
        <MenuIcon />
      </RoundButton>
      {stopWatch}
      <View style={styles.topRightButtonContainer}>
        <RoundButton onPress={() => navigation.navigate('Rating')}>
          <NotificationIcon />
          {unreadNotificationsMarker}
        </RoundButton>
        {tripStatus === TripStatus.Arrived && (
          <PassengerTimer isPassengerLate={isPassengerLate} setIsPassengerLate={() => setIsPassengerLate(true)} />
        )}
      </View>
    </>
  );

  const topBackButton = (
    <RoundButton onPress={() => dispatch(setOrderStatus(OrderStatus.StartRide))}>
      <ShortArrowIcon />
    </RoundButton>
  );

  const topButtons: Record<OrderStatus, ReactNode | null> = {
    startRide: topFullButtons,
    rideUnavaliable: topFullButtons,
    noDrivers: topFullButtons,
    choosingTariff: topBackButton,
    confirming: null,
    confirmation: null,
  };

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <MapView />
        <View style={[styles.topButtonsContainer, computedStyles.topButtonsContainer]}>{topButtons[orderStatus]}</View>
        {contractorInfo ? (
          <>
            <Trip />
            <MapCameraModeButton />
          </>
        ) : (
          <Offer navigation={navigation} />
        )}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} navigation={navigation} />}
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
});

export default RideScreen;
