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
  formatTime,
  getCurrencySign,
  minToMilSec,
  Nullable,
  PhoneIcon,
  Skeleton,
  StatsBlock,
  Text,
  Timer,
  TimerColorModes,
  timerSizes,
  TimerSizesModes,
  TrafficIndicator,
  TrafficLevel,
  useTheme,
} from 'shuttlex-integration';

//TODO: rewrite strange logic with timers
import { tariffByIdSelector } from '../../../../core/ride/redux/offer/selectors';
import {
  contractorAvatarSelector,
  isTripLoadingSelector,
  orderInfoSelector,
  orderTariffIdSelector,
  tripStatusSelector,
} from '../../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import { TimerStateDataType, VisiblePartProps } from './types';

const timerSizeMode = TimerSizesModes.S;

const VisiblePart = ({ setExtraSum, extraSum }: VisiblePartProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { colors } = useTheme();
  const { t } = useTranslation();

  const tripStatus = useSelector(tripStatusSelector);
  const isTripLoading = useSelector(isTripLoadingSelector);
  const orderInfo = useSelector(orderInfoSelector);
  const contractorAvatar = useSelector(contractorAvatarSelector);
  const tripTariffId = useSelector(orderTariffIdSelector);
  const tripTariff = useSelector(state => tariffByIdSelector(state, tripTariffId));

  const [isWaiting, setIsWaiting] = useState(false);
  const [extraWaiting, setExtraWaiting] = useState(false);
  const arrivedTime = orderInfo ? Date.parse(orderInfo.estimatedArriveToDropOffDate) : 0;

  const computedStyles = StyleSheet.create({
    skeletonTimer: {
      width: timerSizes[timerSizeMode].timerSize,
      height: timerSizes[timerSizeMode].timerSize,
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
    plateNumberContainer: {
      backgroundColor: colors.primaryColor,
    },
  });

  useEffect(() => {
    if (extraWaiting && tripTariff) {
      intervalRef.current = setInterval(() => {
        setExtraSum(prev => prev + tripTariff.paidWaitingTimeFeePriceMin);
      }, minToMilSec(1));
    }

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [extraWaiting, setExtraSum, tripTariff]);

  if (orderInfo && tripTariff) {
    const {
      estimatedArriveToPickUpDate,
      carBrand,
      carModel,
      firstName,
      totalLikesCount,
      carNumber,
      totalRidesCount,
      phoneNumber,
    } = orderInfo;

    const waitingTimeMin = tripTariff.freeWaitingTimeMin;

    const getTimerStateData = (status: TripStatus | 'waiting'): Nullable<TimerStateDataType> => {
      switch (status) {
        case TripStatus.Accepted: {
          return {
            timerTime: new Date(estimatedArriveToPickUpDate).getTime(), //change to real data
            mode: TimerColorModes.Mode1,
            title: (
              <>
                <Text style={[styles.nameTimeText, computedStyles.beInAndLvlAmountText]}>
                  {t('ride_Ride_Trip_beIn')}{' '}
                </Text>
                <Text style={styles.nameTimeText}>{formatTime(new Date(estimatedArriveToPickUpDate!))}</Text>
              </>
            ),
          };
        }
        case TripStatus.Arrived: {
          return {
            timerTime: Date.now() + minToMilSec(waitingTimeMin),
            mode: TimerColorModes.Mode2,
            timerLabel: t('ride_Ride_Trip_timerLabelArrived'),
            title: <Text style={styles.nameTimeText}>{t('ride_Ride_Trip_titleArrived')}</Text>,
          };
        }
        case 'waiting': {
          return {
            timerTime: Date.now(), //change to real data
            mode: extraWaiting ? TimerColorModes.Mode5 : TimerColorModes.Mode2,
            timerLabel: t('ride_Ride_Trip_timerLabelWaiting'),
            title: <Text style={styles.nameTimeText}>{t('ride_Ride_Trip_titleWaiting')}</Text>,
          };
        }
        default:
          return null;
      }
    };

    const timerState = getTimerStateData(isWaiting ? 'waiting' : tripStatus);

    const onAfterCountdownEndsHandler = () => {
      if (tripStatus === TripStatus.Arrived) {
        if (isWaiting && !intervalRef.current) {
          setExtraWaiting(true);
        } else {
          setIsWaiting(true);
        }
      }
    };

    if (tripStatus === TripStatus.Ride) {
      return (
        <>
          <View style={styles.topTitleContainer}>
            <Text style={[styles.nameTimeText, computedStyles.beInAndLvlAmountText]}>
              {t('ride_Ride_Trip_youBeIn')}{' '}
            </Text>
            <Text style={styles.nameTimeText}>{formatTime(new Date(arrivedTime))}</Text>
          </View>
          <Text style={[styles.carInfoText, styles.carNameAlign]}>{`${carBrand} ${carModel}`}</Text>
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
              {/*TODO: change to default image*/}
              <Image
                style={styles.driverInfoImage}
                source={{
                  uri: contractorAvatar ?? undefined,
                }}
              />
              <View>
                <Text style={styles.carInfoText}>{firstName}</Text>
                <StatsBlock amountLikes={totalLikesCount ?? 0} />
              </View>
            </View>
            <View style={[styles.plateNumberContainer, computedStyles.plateNumberContainer]}>
              <Text style={styles.carInfoText}>{carNumber}</Text>
            </View>
          </View>
        </>
      );
    }

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
            {isTripLoading ? (
              <Skeleton skeletonContainerStyle={styles.skeletonNameTime} />
            ) : (
              <>
                <Text style={styles.nameTimeText}>{firstName} </Text>
                {timerState?.title}
              </>
            )}
          </View>
          {isTripLoading ? (
            <Skeleton skeletonContainerStyle={styles.skeletonStats} />
          ) : (
            <StatsBlock
              style={styles.statsContainer}
              amountLikes={totalLikesCount ?? 0}
              amountRides={totalRidesCount}
            />
          )}
          <View style={styles.carInfoContainer}>
            {isTripLoading ? (
              <Skeleton skeletonsAmount={2} skeletonContainerStyle={styles.skeletonCarInfo} />
            ) : (
              <>
                <Bar style={styles.carInfoBar}>
                  <Text style={styles.carInfoText}>{`${carBrand} ${carModel}`}</Text>
                </Bar>
                <Bar style={[styles.carInfoPlateNumberBar, computedStyles.carInfoPlateNumberBar]}>
                  <Text style={styles.carInfoText}>{carNumber}</Text>
                </Bar>
              </>
            )}
          </View>
        </View>
        <View style={styles.timerContainer}>
          <View style={styles.buttonContainer}>
            <Button
              shape={ButtonShapes.Circle}
              mode={CircleButtonModes.Mode2}
              size={ButtonSizes.M}
              onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
            >
              <PhoneIcon />
            </Button>
            <Text style={[styles.buttonText, computedStyles.buttonText]}>{t('ride_Ride_Trip_call')}</Text>
          </View>
          {isTripLoading ? (
            <Skeleton skeletonContainerStyle={[styles.skeletonTimer, computedStyles.skeletonTimer]} />
          ) : (
            <View>
              {timerState && (
                <Timer
                  isWaiting={extraWaiting}
                  time={extraWaiting ? 0 : timerState.timerTime}
                  sizeMode={timerSizeMode}
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
          )}
          <View style={styles.buttonContainer}>
            <Bar style={styles.buttonDisable}>
              <ClockIcon color={colors.borderColor} />
            </Bar>
            <Text style={[styles.buttonText, computedStyles.buttonDisableText]}>{t('ride_Ride_Trip_message')}</Text>
          </View>
        </View>
      </View>
    );
  }

  return <></>;
};

const styles = StyleSheet.create({
  skeletonNameTime: {
    width: '60%',
    height: 22,
  },
  skeletonTimer: {
    borderRadius: 100,
  },
  skeletonStats: {
    width: '50%',
    height: 22,
    marginBottom: 12,
  },
  skeletonCarInfo: {
    flex: 1,
    height: 40,
    borderRadius: 12,
  },
  contractorInfoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  nameTimeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
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
  topTitleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  carNameAlign: {
    alignSelf: 'center',
    marginTop: 10,
  },
  trafficIndicatorContainer: {
    marginTop: 16,
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
  driverInfoImage: {
    marginRight: 12,
    objectFit: 'contain',
    width: 52,
    height: 52,
    borderRadius: 1000,
  },
  plateNumberContainer: {
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 9,
  },
});

export default VisiblePart;
