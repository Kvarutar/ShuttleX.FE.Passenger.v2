import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import Share from 'react-native-share';
import {
  Bar,
  Button,
  ButtonShapes,
  CircleButtonModes,
  CloseIcon,
  Fog,
  getPaymentIcon,
  MapView,
  minToMilSec,
  PointIcon2,
  SafeAreaView,
  ShareIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { endTrip } from '../../../core/ride/redux/trip';
import { ReceiptScreenProps } from './props';

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
    bottomContainer: {
      marginBottom: Platform.OS === 'ios' ? 0 : -16,
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
      return t('ride_Receipt_kilometers', { count: Number(distanceInKm) });
    }

    return t('ride_Receipt_meters', { count: distanceInMeters });
  };

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
          <View key={`left_circle_${index}`} style={styles.separatorCircle} />
        ))}
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.separatorTimeText}>{formatDistance(3525)}</Text>
      </View>
      <View style={styles.separatorCircleContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={`right_circle_${index}`} style={styles.separatorCircle} />
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
    <SafeAreaView containerStyle={styles.container}>
      <MapView style={StyleSheet.absoluteFill} />
      <Fog />
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
                {place.address.toUpperCase()}
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
      <View style={computedStyles.bottomContainer}>
        {roadTimeBlock}
        <Bar style={styles.paymentBarContainer}>
          {getPaymentIcon('cash')}
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
      </View>
    </SafeAreaView>
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
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentTitleText: {
    marginTop: 29,
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
  separatorTimeText: {
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
});

export default ReceiptScreen;
