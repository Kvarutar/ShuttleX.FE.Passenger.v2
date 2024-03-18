import React, { useEffect, useState } from 'react';
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
import { useGeolocationStartWatch, useNetworkConnectionStartWatch } from '../../../core/ride/hooks';
import { setOfferStatus } from '../../../core/ride/redux/offer';
import { OfferStatusSelector } from '../../../core/ride/redux/offer/selectors';
import { OfferStatus } from '../../../core/ride/redux/offer/types';
import { setTripStatus } from '../../../core/ride/redux/trip';
import { ContractorInfoSelector, TripStatusSelector } from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import Offer from './Offer';
import PassengerTimer from './PassengerTimer';
import { RideScreenProps } from './props';
import Trip from './Trip';

const RideScreen = ({ navigation }: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [isPassengerLate, setIsPassengerLate] = useState<boolean>(false);
  const tripStatus = useSelector(TripStatusSelector);
  const offerStatus = useSelector(OfferStatusSelector);
  const unreadNotifications = useSelector(numberOfUnreadNotificationsSelector);
  const contractorInfo = useSelector(ContractorInfoSelector);

  useEffect(() => {
    if (contractorInfo) {
      setTimeout(() => {
        dispatch(setTripStatus(TripStatus.Arrived)); //for test
      }, 6000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractorInfo]);

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
    stopWatch = <StopWatch initialDate={new Date(Date.now() + 121000)} mask="{m}m" onAfterCountdownEnds={() => {}} />;
  }

  let topButtons = (
    <>
      <RoundButton onPress={() => navigation.navigate('Rating')}>
        <MenuIcon />
      </RoundButton>
      {stopWatch}
      <View style={styles.headerRightButtons}>
        <RoundButton onPress={() => navigation.navigate('Notifications')}>
          <NotificationIcon />
          {unreadNotificationsMarker}
        </RoundButton>
        {tripStatus === TripStatus.Arrived && (
          <PassengerTimer isPassengerLate={isPassengerLate} setIsPassengerLate={() => setIsPassengerLate(true)} />
        )}
      </View>
    </>
  );

  if (offerStatus === OfferStatus.ChoosingTariff) {
    topButtons = (
      <RoundButton onPress={() => dispatch(setOfferStatus(OfferStatus.StartRide))}>
        <ShortArrowIcon />
      </RoundButton>
    );
  }

  return (
    <>
      <View style={styles.map}>
        <Text>Map</Text>
      </View>
      <SafeAreaView style={styles.wrapper}>
        <View style={[styles.topButtonsContainer, computedStyles.topButtonsContainer]}>{topButtons}</View>
        {contractorInfo ? <Trip /> : <Offer navigation={navigation} />}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  wrapper: {
    flex: 1,
  },
  topButtonsContainer: {
    paddingHorizontal: sizes.paddingHorizontal,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerRightButtons: {
    alignItems: 'center',
  },
  additionalHeaderButtons: {
    marginTop: 30,
  },
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
});

export default RideScreen;
