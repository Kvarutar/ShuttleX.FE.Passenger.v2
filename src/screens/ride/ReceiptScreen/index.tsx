import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import Share from 'react-native-share';
import {
  Bar,
  Button,
  ButtonShapes,
  CircleButtonModes,
  CloseIcon,
  CoinIcon,
  Fog,
  getPaymentIcon,
  minToMilSec,
  PointIcon2,
  SafeAreaView,
  ShareIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { endTrip } from '../../../core/ride/redux/trip';
import passengerColors from '../../../shared/colors/colors';
import MapView from '../RideScreen/MapView';
import { ReceiptScreenProps } from './props';

const windowHeight = Dimensions.get('window').height;

const formatTime = (time: Date): string =>
  time.toLocaleTimeString(getLocales()[0].languageTag, { hour: '2-digit', minute: '2-digit', hour12: false });

const ReceiptScreen = ({ navigation }: ReceiptScreenProps) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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
  });

  const onEndTrip = () => {
    navigation.navigate('Ride');
    dispatch(endTrip());
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

  const formatDistance = (distanceInMeters: number) => {
    if (distanceInMeters > 1000) {
      const distanceInKm = (distanceInMeters / 1000).toFixed(1);
      return { amount: distanceInKm, title: t('ride_Receipt_kilometers') };
    }

    return { amount: distanceInMeters, title: t('ride_Receipt_meters') };
  };

  const distance = formatDistance(3300);

  const placeData = [
    {
      address: 'Home',
      details: 'StreetEasy: NYC Real Estate Search',
    },
    {
      address: 'Work',
      details: 'StreetEasy: NYC Real Estate Search',
    },
  ];

  const roadTimeData = [
    {
      title: t('ride_Receipt_start'),
      value: formatTime(new Date()),
    },
    {
      title: t('ride_Receipt_finish'),
      value: formatTime(new Date(Date.now() + minToMilSec(78))),
    },
    {
      title: t('ride_Receipt_time'),
      value: formatTimeDuration(minToMilSec(78)),
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
        <Text style={styles.separatorDistanceText}>{distance.amount}</Text>
        <Text style={[styles.separatorDistanceText, computedStyles.separatorDistanceText]}>{distance.title}</Text>
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

  return (
    <>
      <MapView />
      <Fog widthInPercents={`${windowHeight / 9.5}%`} />
      <SafeAreaView containerStyle={styles.container} withTransparentBackground>
        <View>
          {header}
          <View style={styles.roadPointContainer}>
            <View style={styles.pointContainer}>
              <PointIcon2 outerColor={colors.iconPrimaryColor} innerColor={colors.primaryColor} />
              <Text style={[styles.pointText, computedStyles.textSecondaryColor]}>{t('ride_Receipt_pickUp')}</Text>
            </View>
            {roadSeparator}
            <View style={styles.pointContainer}>
              <Text style={[styles.pointText, computedStyles.textSecondaryColor]}>{t('ride_Receipt_dropOff')}</Text>
              <PointIcon2 outerColor={colors.iconTertiaryColor} innerColor={colors.errorColor} />
            </View>
          </View>
          <View style={styles.addressContainer}>
            {placeData.map((place, index) => (
              <View style={styles.placeContainer} key={place.address}>
                <Text numberOfLines={1} style={[styles.addressText, index === 1 ? styles.placeTextRight : null]}>
                  {place.address}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.addressDetailsText,
                    computedStyles.textTitleColor,
                    index === 1 ? styles.placeTextRight : null,
                  ]}
                >
                  {place.details}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View>
          {roadTimeBlock}
          <View style={styles.bottomBarsContainer}>
            <Bar style={styles.paymentBarContainer}>
              {getPaymentIcon('cash', { color: colors.textSecondaryColor, style: styles.barIcon })}
              <View>
                <Text style={[styles.paymentTitleText, computedStyles.textSecondaryColor]}>
                  {t('ride_Receipt_paymentTitle')}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.headerAndPaymentText}>{t('ride_Receipt_cash')}</Text>
                  <Text style={[styles.headerAndPaymentText, computedStyles.textSecondaryColor]}>$12,7</Text>
                </View>
              </View>
            </Bar>
            <Bar style={[styles.paymentBarContainer, computedStyles.ticketLotteryContainer]}>
              <CoinIcon style={styles.barIcon} />
              <View>
                <Text style={[styles.paymentTitleText, computedStyles.ticketLotteryTitleText]}>938475992</Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.headerAndPaymentText, computedStyles.ticketLotteryText]}>
                    {t('ride_Receipt_ticketToLottery')}
                  </Text>
                </View>
              </View>
            </Bar>
          </View>
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
  },
  timeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 14,
    marginHorizontal: 6,
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
    marginBottom: 10,
  },
  paymentBarContainer: {
    padding: 16,
    borderWidth: 0,
    flex: 1,
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
  pointText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  separatorDistanceText: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    lineHeight: 22,
  },
  addressText: {
    fontFamily: 'Inter Medium',
    fontSize: 32,
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
});

export default ReceiptScreen;
