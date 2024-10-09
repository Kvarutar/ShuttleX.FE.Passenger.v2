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
  Text,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { endTrip } from '../../../../core/ride/redux/trip';
import { tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
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
      'https://s3-alpha-sig.figma.com/img/028a/c7cf/ffc04a0ea0a94b8d318c4823c0a5f045?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=G2Mbt~~yDOf9urlJIaDzrYHzQ1xg08MujQN9yLngZUK7LDoYaARfj8R0ls-TPxmCuU8uVIy7hwLAOatN6X-3PrqEKFWmVF3DM313W9MmDpHiXTmpSsiTPiNVXOga2gBczexzHVhnQwQItCelonWrryBVYP57W~P1-dQhxxqlXCnZ3upUk9KWPu0CN4xfo-dQnAOn18sGB2nSnT-r1xTd5N3TEfNB~bzFuEB7JTQiBtR8v8cI2B6fA-VMdeAhFTOFEvYs~TFZaGY1FKlIrOVYQMeduj1YFjz9UfKLdzX7VaUFFYaXp0nA9OIlcDaMNuo9BDh6F38OEuVOzu7qi9uBXw__',
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Ride', undefined>>();

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const tripStatus = useSelector(tripStatusSelector);

  const [extraSum, setExtraSum] = useState(0);

  const arrivedTime = Date.now() + contractorInfoTest.approximateArrival;

  const computedStyles = StyleSheet.create({
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
              <StatsBlock amountLikes={contractorInfoTest.contractor.likes} textLikes={t('ride_Ride_Trip_likes')} />
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
      maxHeight={0.9}
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
          onSwipeEnd={() => dispatch(endTrip())}
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
    marginTop: 44,
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
});

export default Trip;
