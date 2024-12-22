import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import {
  Bar,
  Button,
  ButtonShapes,
  CircleButtonModes,
  CloseIcon,
  CoinIcon,
  Fog,
  formatTime,
  getCurrencySign,
  getDistanceBetweenPoints,
  getPaymentIcon,
  MapView,
  MapViewRef,
  mtrToKm,
  PointIcon2,
  SafeAreaView,
  ShareIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';
import { CurrencyType } from 'shuttlex-integration/lib/typescript/src/utils/currency/types';

import { lotteryTicketAfterRideSelector } from '../../../core/lottery/redux/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { offerPointsSelector } from '../../../core/ride/redux/offer/selectors';
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
  const addresses = useSelector(offerPointsSelector);
  const isTripCanceled = useSelector(isTripCanceledSelector);
  const ticket = useSelector(lotteryTicketAfterRideSelector);

  const mapRef = useRef<MapViewRef>(null);

  const finalPrice = () => {
    if (orderInfo?.info) {
      // TODO: ask back about sign(currencyCode), not code
      const { currencyCode, totalFinalPrice, estimatedPrice } = orderInfo.info;
      const currencySign = getCurrencySign(currencyCode as CurrencyType);
      const price = totalFinalPrice ?? estimatedPrice;

      return `${currencySign}${price}`;
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

  const shareFile = async () => {
    const options = {
      title: 'Share File',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf ',
      message: 'Check out this file!',
    };

    try {
      await Share.open(options);
    } catch (error) {
      console.log('Error while sharing the file:', error);
    }
  };

  const formatTimeDuration = (time: number) => {
    const totalMinutes = Math.floor(time / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${t('ride_Receipt_hours', { count: hours })} ${t('ride_Receipt_minutes', { count: minutes })}`;
    }

    if (hours > 0) {
      return t('ride_Receipt_hours', { count: hours });
    }

    return t('ride_Receipt_minutes', { count: minutes });
  };

  const distance = mtrToKm(routeInfo?.totalDistanceMtr ?? 0);
  const isKilometres = routeInfo && routeInfo?.totalDistanceMtr > 1000;

  const roadTimeData = [
    {
      title: t('ride_Receipt_start'),
      value: formatTime(new Date(orderInfo?.info?.estimatedArriveToPickUpDate ?? 0)),
    },
    {
      title: t('ride_Receipt_finish'),
      value: formatTime(new Date(orderInfo?.info?.estimatedArriveToDropOffDate ?? 0)),
    },
    {
      title: t('ride_Receipt_time'),
      value: formatTimeDuration(routeInfo?.totalDurationSec ?? 0),
    },
  ];

  const header = (
    <View style={styles.topButtonsContainer}>
      <Button onPress={onEndTrip} shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2}>
        <CloseIcon />
      </Button>
      <Text style={styles.headerAndPaymentText}>{t('ride_Receipt_check')}</Text>
      <Button onPress={shareFile} shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2}>
        <ShareIcon />
      </Button>
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
      {roadTimeData.map(time => (
        <View key={time.title} style={styles.roadTimeContainer}>
          <Text style={[styles.roadTimeTitleText, computedStyles.textTitleColor]}>{time.title}</Text>
          <Text style={styles.roadTimeValueText}>{time.value}</Text>
        </View>
      ))}
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
      const delta = getDistanceBetweenPoints(startPoint, endPoint) / 40000;

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
                { colorMode: 'mode1', coordinates: startPoint },
                { colorMode: 'mode2', coordinates: endPoint },
              ]
            : undefined
        }
        polylines={startPoint && endPoint ? [{ type: 'arc', options: { startPoint, endPoint } }] : undefined}
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
                {/*{TODO check this data}*/}
                {addresses[0].address}
              </Text>
            </View>
            <View style={styles.placeContainer}>
              <Text
                numberOfLines={2}
                style={[styles.addressDetailsText, computedStyles.textTitleColor, styles.placeTextRight]}
              >
                {/*{TODO check this data}*/}
                {addresses[1].address}
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
    justifyContent: 'space-between',
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
});

export default ReceiptScreen;
