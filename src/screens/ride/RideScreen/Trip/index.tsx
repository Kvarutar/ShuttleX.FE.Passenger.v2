import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BottomWindow,
  BottomWindowWithGesture,
  formatTime,
  StatsBlock,
  SwipeButton,
  SwipeButtonModes,
  Text,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  TrafficIndicator,
  TrafficLevel,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { orderIdSelector, tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
import {
  cancelTrip,
  getTripCanceledAfterPickUpLongPolling,
  getTripSuccessfullLongPolling,
} from '../../../../core/ride/redux/trip/thunks';
import { Order, TripStatus } from '../../../../core/ride/redux/trip/types';
import { RootStackParamList } from '../../../../Navigate/props';
import AlertInitializer from '../../../../shared/AlertInitializer';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const Trip = ({ orderInfo }: { orderInfo: Order }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const tariffIconsData = useTariffsIcons();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Ride', undefined>>();

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const orderId = useSelector(orderIdSelector);
  const [extraSum, setExtraSum] = useState(0);

  const arrivedTime = orderInfo?.info ? Date.parse(orderInfo?.info?.estimatedArriveToDropOffDate) : 0;

  useEffect(() => {
    if (orderId && tripStatus === TripStatus.Ride) {
      dispatch(getTripSuccessfullLongPolling(orderId));
      dispatch(getTripCanceledAfterPickUpLongPolling(orderId));
    }

    if (tripStatus === TripStatus.Finished) {
      navigation.navigate('Rating');
    }
  }, [tripStatus, navigation, orderId, dispatch]);

  //TODO Where can we get tarrifType??? and change TariffIcon
  const TariffIcon = tariffIconsData.Basic.icon;

  const computedStyles = StyleSheet.create({
    avatarWrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    topText: {
      color: colors.textSecondaryColor,
    },
    plateNumberContainer: {
      backgroundColor: colors.primaryColor,
    },
    likesAmount: {
      color: colors.textSecondaryColor,
    },
    likes: {
      color: colors.textTitleColor,
    },
  });

  if (tripStatus === TripStatus.Ride) {
    return (
      <BottomWindow>
        <Timer
          style={{ timerWrapper: styles.timerWrapper }}
          time={arrivedTime}
          sizeMode={TimerSizesModes.S}
          colorMode={TimerColorModes.Mode3}
        />
        <View style={styles.topTitleContainer}>
          <Text style={[styles.topText, computedStyles.topText]}>{t('ride_Ride_Trip_youBeIn')} </Text>
          <Text style={styles.topText}>{formatTime(new Date(arrivedTime))}</Text>
        </View>
        <Text
          style={[styles.text, styles.carNameText]}
        >{`${orderInfo.info?.carBrand} ${orderInfo.info?.carModel}`}</Text>
        {/*TODO: delete mock data*/}
        <TrafficIndicator
          containerStyle={styles.trafficIndicatorContainer}
          currentPercent={`${70}%`}
          segments={[
            { percent: '15%', level: TrafficLevel.Low },
            { percent: '15%', level: TrafficLevel.Average },
            { percent: '30%', level: TrafficLevel.High },
            { percent: '40%', level: TrafficLevel.Low },
          ]}
        />
        <View style={styles.driverInfoWrapper}>
          <View style={styles.driverInfoContainer}>
            <Image
              style={styles.image}
              source={{
                uri: orderInfo.avatar,
              }}
            />
            <View>
              <Text style={styles.text}>{orderInfo?.info?.firstName}</Text>
              <StatsBlock amountLikes={orderInfo?.info?.totalLikesCount ?? 0} />
            </View>
          </View>
          <View style={[styles.plateNumberContainer, computedStyles.plateNumberContainer]}>
            <Text style={styles.text}>{orderInfo?.info?.carNumber}</Text>
          </View>
        </View>
      </BottomWindow>
    );
  }

  return (
    <BottomWindowWithGesture
      maxHeight={0.88}
      headerWrapperStyle={styles.headerWrapperStyle}
      headerElement={
        <View style={styles.imageContainer}>
          <TariffIcon style={styles.carImage} />
          <View style={[styles.avatarWrapper, computedStyles.avatarWrapper]}>
            <Image
              style={styles.avatar}
              source={{
                uri: orderInfo.avatar,
              }}
            />
          </View>
        </View>
      }
      withAllPartsScroll
      withHiddenPartScroll={false}
      alerts={alerts.map(alertData => (
        <AlertInitializer
          key={alertData.id}
          id={alertData.id}
          priority={alertData.priority}
          type={alertData.type}
          options={'options' in alertData ? alertData.options : undefined}
        />
      ))}
      visiblePart={<VisiblePart setExtraSum={setExtraSum} extraSum={extraSum} orderInfo={orderInfo} />}
      hiddenPart={<HiddenPart extraSum={extraSum} />}
      visiblePartStyle={styles.visiblePartStyle}
      hiddenPartButton={
        <SwipeButton
          mode={SwipeButtonModes.Decline}
          onSwipeEnd={() => orderId && dispatch(cancelTrip(orderId))}
          text={t('ride_Ride_Trip_cancelRideButton')}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  visiblePartStyle: {
    marginBottom: 16,
    paddingTop: 5,
  },
  headerWrapperStyle: {
    height: 40,
    justifyContent: 'flex-end',
  },
  timerWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    top: -45,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -45,
  },
  avatarWrapper: {
    padding: 3,
    borderRadius: 100,
    position: 'absolute',
    right: 25,
    width: 72,
    height: 72,
  },
  avatar: {
    flex: 1,
    objectFit: 'contain',
    borderRadius: 100,
  },
  carImage: {
    resizeMode: 'cover',
    width: '65%',
    height: undefined,
    aspectRatio: 3.15,
  },
  topText: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
    lineHeight: 22,
  },
  text: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  topTitleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 40,
  },
  carNameText: {
    alignSelf: 'center',
    marginTop: 10,
  },
  driverInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  driverInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plateNumberContainer: {
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 9,
  },
  image: {
    marginRight: 12,
    objectFit: 'contain',
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  trafficIndicatorContainer: {
    marginTop: 16,
  },
});

export default Trip;
