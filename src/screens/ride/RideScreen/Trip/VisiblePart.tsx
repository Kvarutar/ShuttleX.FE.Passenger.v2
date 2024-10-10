import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  ClockIcon,
  minToMilSec,
  PhoneIcon,
  StatsBlock,
  TariffType,
  Text,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { setTripStatus } from '../../../../core/ride/redux/trip';
import { tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import { formatTime } from './index';
import { TimerStateDataType, VisiblePartProps } from './props';

//TODO: swap contractorInfoTest to contractorInfo
const contractorInfoTest = {
  contractor: {
    name: 'Slava',
    image:
      'https://s3-alpha-sig.figma.com/img/028a/c7cf/ffc04a0ea0a94b8d318c4823c0a5f045?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=G2Mbt~~yDOf9urlJIaDzrYHzQ1xg08MujQN9yLngZUK7LDoYaARfj8R0ls-TPxmCuU8uVIy7hwLAOatN6X-3PrqEKFWmVF3DM313W9MmDpHiXTmpSsiTPiNVXOga2gBczexzHVhnQwQItCelonWrryBVYP57W~P1-dQhxxqlXCnZ3upUk9KWPu0CN4xfo-dQnAOn18sGB2nSnT-r1xTd5N3TEfNB~bzFuEB7JTQiBtR8v8cI2B6fA-VMdeAhFTOFEvYs~TFZaGY1FKlIrOVYQMeduj1YFjz9UfKLdzX7VaUFFYaXp0nA9OIlcDaMNuo9BDh6F38OEuVOzu7qi9uBXw__',
    car: {
      model: 'Toyota Land Cruiser',
      plateNumber: 'BB 4177 CH',
    },
  },
  phone: '+380999999999',
  tripType: 'Basic',
  total: 20,
};

const testExtraSum = 0.5;

const VisiblePart = ({ setExtraSum, extraSum }: VisiblePartProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { colors } = useTheme();
  const { t } = useTranslation();
  const tariffIconsData = useTariffsIcons();

  const tripStatus = useSelector(tripStatusSelector);
  const dispatch = useAppDispatch();

  const [isWaiting, setIsWaiting] = useState(false);
  const [extraWaiting, setExtraWaiting] = useState(false);

  const TariffIcon = tariffIconsData[contractorInfoTest.tripType as TariffType].icon;

  const computedStyles = StyleSheet.create({
    avatarWrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    beInAndLvlAmountText: {
      color: colors.textSecondaryColor,
    },
    separateCircle: {
      backgroundColor: colors.iconSecondaryColor,
    },
    carInfoPlateNumberBar: {
      backgroundColor: colors.primaryColor,
    },
    buttonText: {
      color: colors.textSecondaryColor,
    },
    buttonDisableText: {
      color: colors.borderColor,
    },
    timerLabelContainer: {
      backgroundColor: extraWaiting ? '#FFB090' : colors.backgroundTertiaryColor,
    },
    timerLabelText: {
      color: extraWaiting ? colors.errorColor : colors.textTertiaryColor,
    },
    //TODO: remove comments when we will show a contractor lvl

    // nameTimeContainer: {
    // marginTop: tripStatus === TripStatus.Idle ? 0 : 20,
    // },
    lvlText: {
      color: colors.textTitleColor,
    },
  });

  const timerStateData: Record<string, TimerStateDataType> = {
    idle: {
      timerTime: Date.now() + minToMilSec(0.5),
      mode: TimerColorModes.Mode1,
      title: (
        <>
          <Text style={[styles.nameTimeText, computedStyles.beInAndLvlAmountText]}>{t('ride_Ride_Trip_beIn')} </Text>
          <Text style={styles.nameTimeText}>{formatTime(new Date(Date.now() + minToMilSec(0.5)))}</Text>
        </>
      ),
    },
    arrived: {
      timerTime: Date.now(),
      mode: TimerColorModes.Mode2,
      timerLabel: t('ride_Ride_Trip_timerLabelArrived'),
      title: <Text style={styles.nameTimeText}>{t('ride_Ride_Trip_titleArrived')}</Text>,
    },
    waiting: {
      timerTime: Date.now() + minToMilSec(0.5),
      mode: extraWaiting ? TimerColorModes.Mode5 : TimerColorModes.Mode2,
      timerLabel: t('ride_Ride_Trip_timerLabelWaiting'),
      title: <Text style={styles.nameTimeText}>{t('ride_Ride_Trip_titleWaiting')}</Text>,
    },
  };

  //for test
  useEffect(() => {
    if (extraSum > 1.5) {
      dispatch(setTripStatus(TripStatus.Ride));
    }
  }, [dispatch, extraSum]);

  useEffect(() => {
    if (extraWaiting) {
      intervalRef.current = setInterval(() => {
        setExtraSum(prev => prev + testExtraSum);
      }, 10000);
    }

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [extraWaiting, setExtraSum]);

  const timerState = timerStateData[isWaiting ? 'waiting' : tripStatus];

  const onAfterCountdownEndsHandler = () => {
    if (tripStatus === TripStatus.Idle) {
      dispatch(setTripStatus(TripStatus.Arrived));
    }

    if (tripStatus === TripStatus.Arrived) {
      if (isWaiting && !intervalRef.current) {
        setExtraWaiting(true);
      } else {
        setTimeout(() => {
          setIsWaiting(true);
        }, 2000);
      }
    }
  };

  return (
    <View>
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
      <View style={styles.contractorInfoContainer}>
        {/*TODO: remove comments when we will show a contractor lvl */}
        {/*{tripStatus === TripStatus.Idle && (*/}
        {/*  <View style={styles.lvlContainer}>*/}
        {/*    <CrownIcon />*/}
        {/*    <Text style={[styles.lvlText, computedStyles.beInAndLvlAmountText]}> 45 </Text>*/}
        {/*    <Text style={[styles.lvlText, computedStyles.lvlText]}>{t('ride_Ride_Trip_lvl')}</Text>*/}
        {/*  </View>*/}
        {/*)}*/}
        <View style={styles.nameTimeContainer}>
          <Text style={styles.nameTimeText}>{contractorInfoTest.contractor.name} </Text>
          {timerState.title}
        </View>
        <StatsBlock
          style={styles.statsContainer}
          amountLikes={325}
          textLikes={t('ride_Ride_Trip_likes')}
          amountRides={53153}
          textRides={t('ride_Ride_Trip_rides')}
        />
        <View style={styles.carInfoContainer}>
          <Bar style={styles.carInfoBar}>
            <Text style={styles.carInfoText}>{contractorInfoTest.contractor.car.model}</Text>
          </Bar>
          <Bar style={[styles.carInfoPlateNumberBar, computedStyles.carInfoPlateNumberBar]}>
            <Text style={styles.carInfoText}>{contractorInfoTest.contractor.car.plateNumber}</Text>
          </Bar>
        </View>
      </View>
      <View style={styles.timerContainer}>
        <View style={styles.buttonContainer}>
          <Button
            shape={ButtonShapes.Circle}
            mode={CircleButtonModes.Mode2}
            size={ButtonSizes.M}
            onPress={() => Linking.openURL(`tel:${contractorInfoTest.phone}`)}
          >
            <PhoneIcon />
          </Button>
          <Text style={[styles.buttonText, computedStyles.buttonText]}>{t('ride_Ride_Trip_call')}</Text>
        </View>
        <View>
          <Timer
            isWaiting={extraWaiting}
            time={extraWaiting ? 0 : timerState.timerTime}
            sizeMode={TimerSizesModes.S}
            colorMode={timerState.mode}
            onAfterCountdownEnds={onAfterCountdownEndsHandler}
          />
          {timerState?.timerLabel && (
            <View style={[styles.timerLabelContainer, computedStyles.timerLabelContainer]}>
              <Text style={[styles.timerLabelText, computedStyles.timerLabelText]}>
                {extraWaiting ? `-$${extraSum}` : timerState.timerLabel}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Bar style={styles.buttonDisable}>
            <ClockIcon color={colors.borderColor} />
          </Bar>
          <Text style={[styles.buttonText, computedStyles.buttonDisableText]}>{t('ride_Ride_Trip_message')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -75,
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
    aspectRatio: 3,
  },
  contractorInfoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  nameTimeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 20,
  },
  nameTimeText: {
    fontSize: 21,
    lineHeight: 22,
    fontFamily: 'Inter Medium',
  },
  statsContainer: {
    marginBottom: 12,
  },
  carInfoContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  carInfoBar: {
    paddingHorizontal: 21,
    paddingVertical: 9,
  },
  carInfoText: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'Inter Medium',
  },
  carInfoPlateNumberBar: {
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 0,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
    marginTop: 5,
  },
  buttonDisable: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  timerLabelContainer: {
    width: 64,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 1,
  },
  timerLabelText: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  lvlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 9,
  },
  lvlText: {
    fontSize: 14,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
});

export default VisiblePart;
