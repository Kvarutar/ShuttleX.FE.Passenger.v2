import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  Button,
  ButtonShapes,
  CircleButtonModes,
  CloseIcon,
  CoinIcon,
  decodeGooglePolyline,
  Fog,
  formatCurrency,
  formatTime,
  getDistanceBetweenPoints,
  getPaymentIcon,
  LoadingSpinner,
  LoadingSpinnerIconModes,
  MapView,
  MapViewRef,
  mtrToKm,
  PointIcon2,
  SafeAreaView,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { lotteryTicketAfterRideSelector } from '../../../core/lottery/redux/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { cleanOrder } from '../../../core/ride/redux/order';
import { endTrip } from '../../../core/ride/redux/trip';
import {
  isTripCanceledSelector,
  orderSelector,
  tripDropOffRouteSelector,
} from '../../../core/ride/redux/trip/selectors';
import { RootStackParamList } from '../../../Navigate/props';
import passengerColors from '../../../shared/colors/colors';

const windowHeight = Dimensions.get('window').height;

const ReceiptScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Receipt'>>();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const routeInfo = useSelector(tripDropOffRouteSelector);
  const orderInfo = useSelector(orderSelector);
  const isTripCanceled = useSelector(isTripCanceledSelector);
  const ticket = useSelector(lotteryTicketAfterRideSelector);

  const mapRef = useRef<MapViewRef>(null);

  const finalPrice = () => {
    if (orderInfo?.info) {
      const { currencyCode, totalFinalPrice, estimatedPrice } = orderInfo.info;
      return formatCurrency(currencyCode, totalFinalPrice ?? estimatedPrice);
    }
  };

  const computedStyles = StyleSheet.create({
    textSecondaryColor: {
      color: colors.textSecondaryColor,
    },
    textTitleColor: {
      color: colors.textTitleColor,
    },
    timeContainer: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    separatorCircle: {
      backgroundColor: colors.iconSecondaryColor,
    },
    separatorDistanceText: {
      color: colors.textSecondaryColor,
    },
    ticketLotteryContainer: {
      backgroundColor: passengerColors.lotteryColors.background,
    },
    ticketLotteryText: {
      color: colors.textTertiaryColor,
    },
    ticketLotteryTitleText: {
      color: passengerColors.lotteryColors.text,
    },
    cancelledTripTitleContainer: {
      backgroundColor: colors.errorColor,
    },
    cancelledTripTitleText: {
      color: colors.textTertiaryColor,
    },
  });

  const onEndTrip = async () => {
    dispatch(cleanOrder());
    dispatch(endTrip());
    navigation.navigate('Ride');
  };

  //TODO: return when we need to shareButton
  // const shareFile = async () => {
  //   const options = {
  //     title: 'Share File',
  //     url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf ',
  //     message: 'Check out this file!',
  //   };
  //
  //   try {
  //     await Share.open(options);
  //   } catch (error) {
  //     console.log('Error while sharing the file:', error);
  //   }
  // };

  const tripTimeDuration = () => {
    const [pickUpTime, finishedTime] = [
      new Date(orderInfo?.info?.pickUpDate ?? new Date()),
      new Date(orderInfo?.info?.finishedDate ?? new Date()),
    ].map(date => {
      date.setSeconds(0, 0);
      return date.getTime();
    });

    const duration = finishedTime - pickUpTime;

    const totalMinutes = Math.floor(duration / 60000);
    const [hours, minutes] = [Math.floor(totalMinutes / 60), totalMinutes % 60];

    if (duration < 60000) {
      return `>${t('ride_Receipt_minutes', { count: 1 })}`;
    }

    return hours && minutes
      ? `${t('ride_Receipt_hours', { count: hours })} ${t('ride_Receipt_minutes', { count: minutes })}`
      : t(hours ? 'ride_Receipt_hours' : 'ride_Receipt_minutes', { count: hours || minutes });
  };

  const distance = mtrToKm(routeInfo?.totalDistanceMtr ?? 0);
  const isKilometres = routeInfo && routeInfo?.totalDistanceMtr > 1000;

  const roadTimeData = [
    {
      title: t('ride_Receipt_start'),
      value: formatTime(new Date(orderInfo?.info?.pickUpDate ?? 0)),
    },
    {
      title: t('ride_Receipt_finish'),
      value: formatTime(new Date(orderInfo?.info?.finishedDate ?? 0)),
    },
    {
      title: t('ride_Receipt_time'),
      value: tripTimeDuration(),
    },
  ];

  const header = (
    <View style={styles.topButtonsContainer}>
      <Button onPress={onEndTrip} shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2}>
        <CloseIcon />
      </Button>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerAndPaymentText}>{t('ride_Receipt_check')}</Text>
      </View>
    </View>
  );

  const roadSeparator = (
    <View style={styles.roadSeparatorContainer}>
      <View style={styles.separatorCircleContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={`left_circle_${index}`} style={[styles.separatorCircle, computedStyles.separatorCircle]} />
        ))}
      </View>
      <View style={[styles.timeContainer, computedStyles.timeContainer]}>
        <Text style={styles.separatorDistanceText}>{distance}</Text>
        <Text style={[styles.separatorDistanceText, computedStyles.separatorDistanceText]}>
          {isKilometres ? t('ride_Receipt_kilometers') : t('ride_Receipt_meters')}
        </Text>
      </View>
      <View style={styles.separatorCircleContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={`right_circle_${index}`} style={[styles.separatorCircle, computedStyles.separatorCircle]} />
        ))}
      </View>
    </View>
  );

  const roadTimeBlock = (
    <View style={styles.roadTimeWrapper}>
      {orderInfo?.info?.pickUpDate && orderInfo?.info?.finishedDate ? (
        roadTimeData.map(time => (
          <View key={time.title} style={styles.roadTimeContainer}>
            <Text style={[styles.roadTimeTitleText, computedStyles.textTitleColor]}>{time.title}</Text>
            <Text style={styles.roadTimeValueText}>{time.value}</Text>
          </View>
        ))
      ) : (
        <LoadingSpinner iconMode={LoadingSpinnerIconModes.Mini} style={styles.roadTimeBlockLoader} />
      )}
    </View>
  );

  const paymentBarBlock = (
    <Bar style={[styles.paymentBarContainer]}>
      {getPaymentIcon('cash', { color: colors.textSecondaryColor, style: styles.barIcon })}
      <View>
        <Text style={[styles.paymentTitleText, computedStyles.textSecondaryColor]}>
          {t('ride_Receipt_paymentTitle')}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.headerAndPaymentText}>{t('ride_Receipt_cash')}</Text>
          <Text style={[styles.headerAndPaymentText, computedStyles.textSecondaryColor]}>{finalPrice()}</Text>
        </View>
      </View>
    </Bar>
  );

  const startPoint = routeInfo?.waypoints[0].geo;
  const endPoint = routeInfo?.waypoints[routeInfo.waypoints.length - 1].geo;

  const onMapLayout = useCallback(() => {
    if (mapRef.current && startPoint && endPoint) {
      const delta = getDistanceBetweenPoints(startPoint, endPoint) / 35000;

      mapRef.current.animateToRegion(
        {
          latitude: (startPoint.latitude + endPoint.latitude) / 2,
          longitude: (startPoint.longitude + endPoint.longitude) / 2,
          latitudeDelta: delta,
          longitudeDelta: delta,
        },
        0,
      );
    }
  }, [startPoint, endPoint]);

  return (
    <>
      <MapView
        ref={mapRef}
        onLayout={onMapLayout}
        style={StyleSheet.absoluteFill}
        markers={
          startPoint && endPoint
            ? [
                { type: 'simple', colorMode: 'mode1', coordinates: startPoint },
                { type: 'simple', colorMode: 'mode2', coordinates: endPoint },
              ]
            : undefined
        }
        polylines={
          routeInfo
            ? [{ type: 'straight', options: { coordinates: decodeGooglePolyline(routeInfo.geometry) } }]
            : undefined
        }
      />
      <Fog widthInPercents={`${windowHeight / 9.5}%`} />
      <SafeAreaView containerStyle={styles.container} withTransparentBackground>
        <View>
          {header}
          <View style={styles.roadPointContainer}>
            <View style={styles.pointContainer}>
              <PointIcon2 outerColor={colors.iconPrimaryColor} innerColor={colors.primaryColor} />
              <Text numberOfLines={1} style={styles.pointText}>
                {t('ride_Receipt_pickUpTitle')}
              </Text>
            </View>
            <View style={styles.pointContainer}>
              <Text numberOfLines={1} style={styles.pointText}>
                {t('ride_Receipt_dropOffTitle')}
              </Text>
              <PointIcon2 outerColor={colors.iconTertiaryColor} innerColor={colors.errorColor} />
            </View>
          </View>
          {roadSeparator}
          <View style={styles.addressContainer}>
            <View style={styles.placeContainer}>
              <Text numberOfLines={2} style={[styles.addressDetailsText, computedStyles.textTitleColor]}>
                {orderInfo?.info?.pickUpFullAddress}
              </Text>
            </View>
            <View style={styles.placeContainer}>
              <Text
                numberOfLines={2}
                style={[styles.addressDetailsText, computedStyles.textTitleColor, styles.placeTextRight]}
              >
                {orderInfo?.info?.dropOffFullAddress}
              </Text>
            </View>
          </View>
        </View>
        <View>
          {isTripCanceled ? (
            <View style={styles.cancelledTripContainer}>
              <View style={[styles.cancelledTripTitleContainer, computedStyles.cancelledTripTitleContainer]}>
                <Text style={[styles.cancelledTripTitleText, computedStyles.cancelledTripTitleText]}>
                  {t('ride_Receipt_cancelledTrip')}
                </Text>
              </View>
              {Boolean(orderInfo?.info) && paymentBarBlock}
            </View>
          ) : (
            <>
              {roadTimeBlock}
              <View style={styles.bottomBarsContainer}>
                {paymentBarBlock}
                {ticket && (
                  <Bar style={[styles.paymentBarContainer, computedStyles.ticketLotteryContainer]}>
                    <CoinIcon style={styles.barIcon} />
                    <View>
                      <Text style={[styles.paymentTitleText, computedStyles.ticketLotteryTitleText]}>
                        {ticket.ticketNumber}
                      </Text>
                      <View style={styles.priceContainer}>
                        <Text style={[styles.headerAndPaymentText, computedStyles.ticketLotteryText]}>
                          {t('ride_Receipt_ticketToLottery')}
                        </Text>
                      </View>
                    </View>
                  </Bar>
                )}
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  pointContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roadPointContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separatorCircleContainer: {
    gap: 6,
    flexDirection: 'row',
  },
  separatorCircle: {
    width: 4,
    height: 4,
    borderRadius: 100,
    backgroundColor: 'black',
  },
  roadSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 14,
    marginHorizontal: 6,
    minWidth: 64,
    justifyContent: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  placeContainer: {
    flex: 1,
    gap: 4,
    marginTop: 2,
  },
  placeTextRight: {
    textAlign: 'right',
  },
  roadTimeWrapper: {
    flexDirection: 'row',
    gap: 18,
  },
  roadTimeContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  paymentBarContainer: {
    padding: 16,
    borderWidth: 0,
    flexGrow: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentTitleText: {
    marginTop: 44,
    marginBottom: 2,
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  headerAndPaymentText: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  separatorDistanceText: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    lineHeight: 22,
  },
  pointText: {
    fontFamily: 'Inter Medium',
    fontSize: 32,
    lineHeight: 32,
  },
  addressDetailsText: {
    fontSize: 14,
    lineHeight: 18,
  },
  roadTimeTitleText: {
    fontSize: 14,
    lineHeight: 16,
  },
  roadTimeValueText: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  bottomBarsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  barIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  cancelledTripContainer: {
    width: '50%',
    minWidth: 180,
    alignSelf: 'center',
  },
  cancelledTripTitleContainer: {
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelledTripTitleText: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  roadTimeBlockLoader: {
    marginBottom: 16,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 44,
  },
});

export default ReceiptScreen;
