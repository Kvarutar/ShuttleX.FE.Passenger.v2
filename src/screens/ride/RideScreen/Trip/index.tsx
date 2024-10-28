import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import { useSelector } from 'react-redux';
import {
  BottomWindow,
  BottomWindowWithGesture,
  minToMilSec,
  StatsBlock,
  SwipeButton,
  SwipeButtonModes,
  TariffType,
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
import { tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
import { cancelTrip } from '../../../../core/ride/redux/trip/thunks';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import { RootStackParamList } from '../../../../Navigate/props';
import AlertInitializer from '../../../../shared/AlertInitializer';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

//TODO swap to contractorInfo
const contractorInfoTest = {
  contractor: {
    name: 'Slava',
    likes: 3255,
    image:
      'https://s3-alpha-sig.figma.com/img/a077/4174/e90e7da558343949a212b72e0498120b?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qK4OdlwMzlcgqwjJbjVHCLWtIZxc6mK1QoOJuGD90uBLnuE~i5E5M6rK4TXKSYgOQg84OJzaGezQZlnf08wr3kPKOm-9LEql~LwzsDIoRi7dPIrx54jQ-58pcoJn8iossxaMahEKJKyAlvCbXY50-h-9Vw7J-m0lbq9kStIc19UsjcyagEZEwqGvhgDo-HMHPy2t0XY87zNUrLlOOs6xkj~DnsxUeSf8wG-cON2vHw3khDJ4W6IYYq2mocnWY~MlivnsxZmYo5wNhdubaw7yarsi-OxaOL5RqiFXNw9Ce66YsR9NMRyI7vN9hpGJeH2S6IEK2apoYnoLKXIq3P-vgg__',
    car: {
      model: 'Toyota Land Cruiser',
      plateNumber: 'BB 4177 CH',
    },
  },
  approximateArrival: minToMilSec(0.5), //travel time
  tripType: 'Basic',
  total: 20,
};

export const formatTime = (time: Date): string =>
  time
    .toLocaleTimeString(getLocales()[0].languageTag, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/^0/, '');

const Trip = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const tariffIconsData = useTariffsIcons();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Ride', undefined>>();

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const tripStatus = useSelector(tripStatusSelector);

  const [extraSum, setExtraSum] = useState(0);

  const arrivedTime = Date.now() + contractorInfoTest.approximateArrival;

  const TariffIcon = tariffIconsData[contractorInfoTest.tripType as TariffType].icon;

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
          onAfterCountdownEnds={() => navigation.navigate('Rating')}
        />
        <View style={styles.topTitleContainer}>
          <Text style={[styles.topText, computedStyles.topText]}>{t('ride_Ride_Trip_youBeIn')} </Text>
          <Text style={styles.topText}>{formatTime(new Date(arrivedTime))}</Text>
        </View>
        <Text style={[styles.text, styles.carNameText]}>{contractorInfoTest.contractor.car.model}</Text>
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
                uri: contractorInfoTest.contractor.image,
              }}
            />
            <View>
              <Text style={styles.text}>{contractorInfoTest.contractor.name}</Text>
              <StatsBlock amountLikes={contractorInfoTest.contractor.likes} />
            </View>
          </View>
          <View style={[styles.plateNumberContainer, computedStyles.plateNumberContainer]}>
            <Text style={styles.text}>{contractorInfoTest.contractor.car.plateNumber}</Text>
          </View>
        </View>
      </BottomWindow>
    );
  }

  return (
    <BottomWindowWithGesture
      maxHeight={0.88}
      headerElement={
        <View style={styles.imageContainer}>
          <TariffIcon style={styles.carImage} />
          <View style={[styles.avatarWrapper, computedStyles.avatarWrapper]}>
            <Image
              style={styles.avatar}
              source={{
                uri: contractorInfoTest.contractor.image,
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
      visiblePart={<VisiblePart setExtraSum={setExtraSum} extraSum={extraSum} />}
      hiddenPart={<HiddenPart extraSum={extraSum} />}
      visiblePartStyle={styles.visiblePartStyle}
      bottomWindowStyle={styles.bottomWindowStyle}
      hiddenPartButton={
        <SwipeButton
          mode={SwipeButtonModes.Decline}
          onSwipeEnd={() => dispatch(cancelTrip())}
          text={t('ride_Ride_Trip_cancelRideButton')}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  visiblePartStyle: {
    marginBottom: 26,
  },
  bottomWindowStyle: {
    paddingTop: 5,
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
    marginBottom: 10,
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
