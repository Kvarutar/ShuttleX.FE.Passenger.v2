import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  ClockIcon,
  formatTime,
  getCurrencySign,
  minToMilSec,
  Nullable,
  PhoneIcon,
  StatsBlock,
  Text,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  useTheme,
} from 'shuttlex-integration';

import { tripStatusSelector } from '../../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import { TimerStateDataType, VisiblePartProps } from './types';

const testExtraSum = 0.5;

const VisiblePart = ({ setExtraSum, extraSum, orderInfo }: VisiblePartProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { colors } = useTheme();
  const { t } = useTranslation();

  const tripStatus = useSelector(tripStatusSelector);

  const [isWaiting, setIsWaiting] = useState(false);
  const [extraWaiting, setExtraWaiting] = useState(false);

  const computedStyles = StyleSheet.create({
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

  const getTimerStateData = (status: TripStatus | 'waiting'): Nullable<TimerStateDataType> => {
    switch (status) {
      case TripStatus.Accepted: {
        return {
          timerTime: Date.now() + minToMilSec(0.5), //change to real data
          mode: TimerColorModes.Mode1,
          title: (
            <>
              <Text style={[styles.nameTimeText, computedStyles.beInAndLvlAmountText]}>
                {t('ride_Ride_Trip_beIn')}{' '}
              </Text>
              <Text style={styles.nameTimeText}>{formatTime(new Date(Date.now() + minToMilSec(0.5)))}</Text>
            </>
          ),
        };
      }
      case TripStatus.Arrived: {
        return {
          timerTime: Date.now(),
          mode: TimerColorModes.Mode2,
          timerLabel: t('ride_Ride_Trip_timerLabelArrived'),
          title: <Text style={styles.nameTimeText}>{t('ride_Ride_Trip_titleArrived')}</Text>,
        };
      }
      case 'waiting': {
        return {
          timerTime: Date.now() + minToMilSec(0.5), //change to real data
          mode: extraWaiting ? TimerColorModes.Mode5 : TimerColorModes.Mode2,
          timerLabel: t('ride_Ride_Trip_timerLabelWaiting'),
          title: <Text style={styles.nameTimeText}>{t('ride_Ride_Trip_titleWaiting')}</Text>,
        };
      }
      default:
        return null;
    }
  };

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

  const timerState = getTimerStateData(isWaiting ? 'waiting' : tripStatus);

  const onAfterCountdownEndsHandler = () => {
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
          <Text style={styles.nameTimeText}>{orderInfo?.info?.firstName} </Text>
          {timerState?.title}
        </View>
        <StatsBlock
          style={styles.statsContainer}
          amountLikes={orderInfo.info?.totalLikesCount ?? 0}
          amountRides={orderInfo.info?.totalRidesCount}
        />
        <View style={styles.carInfoContainer}>
          <Bar style={styles.carInfoBar}>
            <Text style={styles.carInfoText}>{`${orderInfo.info?.carBrand} ${orderInfo.info?.carModel}`}</Text>
          </Bar>
          <Bar style={[styles.carInfoPlateNumberBar, computedStyles.carInfoPlateNumberBar]}>
            <Text style={styles.carInfoText}>{orderInfo?.info?.carNumber}</Text>
          </Bar>
        </View>
      </View>
      <View style={styles.timerContainer}>
        <View style={styles.buttonContainer}>
          <Button
            shape={ButtonShapes.Circle}
            mode={CircleButtonModes.Mode2}
            size={ButtonSizes.M}
            onPress={() => Linking.openURL(`tel:${orderInfo?.info?.phoneNumber}`)}
          >
            <PhoneIcon />
          </Button>
          <Text style={[styles.buttonText, computedStyles.buttonText]}>{t('ride_Ride_Trip_call')}</Text>
        </View>
        <View>
          {timerState && (
            <Timer
              isWaiting={extraWaiting}
              time={extraWaiting ? 0 : timerState.timerTime}
              sizeMode={TimerSizesModes.S}
              colorMode={timerState.mode}
              onAfterCountdownEnds={onAfterCountdownEndsHandler}
            />
          )}

          {timerState?.timerLabel && (
            <View style={[styles.timerLabelContainer, computedStyles.timerLabelContainer]}>
              <Text style={[styles.timerLabelText, computedStyles.timerLabelText]}>
                {extraWaiting ? `-${getCurrencySign('UAH')}${extraSum}` : timerState.timerLabel}
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
