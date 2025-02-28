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
  formatCurrency,
  formatTime,
  minToMilSec,
  Nullable,
  PhoneIcon,
  secToMilSec,
  Skeleton,
  StatsBlock,
  Text,
  Timer,
  TimerColorModes,
  timerSizes,
  TimerSizesModes,
  TrafficIndicator,
  TrafficIndicatorProps,
  useTheme,
} from 'shuttlex-integration';

import {
  mapRidePercentFromPolylinesSelector,
  mapRouteTrafficSelector,
} from '../../../../core/ride/redux/map/selectors';
//TODO: rewrite strange logic with timers
import {
  contractorAvatarSelector,
  isTripLoadingSelector,
  orderInfoSelector,
  orderTariffInfoSelector,
  tripStatusSelector,
} from '../../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import { trafficLoadFromAPIToTrafficLevel } from '../../../../core/utils';
import { TimerStateDataType } from './types';

const timerSizeMode = TimerSizesModes.S;

const VisiblePart = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { colors } = useTheme();
  const { t } = useTranslation();

  const tripStatus = useSelector(tripStatusSelector);
  const isTripLoading = useSelector(isTripLoadingSelector);
  const orderInfo = useSelector(orderInfoSelector);
  const contractorAvatar = useSelector(contractorAvatarSelector);
  const tripTariff = useSelector(orderTariffInfoSelector);
  const ridePercentFromPolylines = useSelector(mapRidePercentFromPolylinesSelector);
  const routeTraffic = useSelector(mapRouteTrafficSelector);

  const [isWaiting, setIsWaiting] = useState(false);
  const [extraWaiting, setExtraWaiting] = useState(false);
  const [routeStartDate, setRouteStartDate] = useState<Date | undefined>(undefined);
  const [routeEndDate, setRouteEndDate] = useState<Date | undefined>(undefined);
  const [extraWaitingTimeInSec, setExtraWaitingTimeInSec] = useState<number>(0);
  const [extraSum, setExtraSum] = useState(0);

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
    defaultAvatar: {
      backgroundColor: colors.backgroundPrimaryColor,
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

  useEffect(() => {
    if (!orderInfo) {
      return;
    }

    // TODO: make redux state that saves all information about current route, to delete many comparisons of tripStatus in code base
    if (tripStatus === TripStatus.Accepted) {
      setRouteStartDate(new Date(orderInfo.createdDate));
      setRouteEndDate(new Date(orderInfo.estimatedArriveToPickUpDate));
    } else if (tripStatus === TripStatus.Ride) {
      setRouteStartDate(new Date(orderInfo.pickUpDate));
      setRouteEndDate(new Date(orderInfo.estimatedArriveToDropOffDate));
    }
  }, [tripStatus, orderInfo]);

  useEffect(() => {
    //!isTripLoading is added because While the information is still loading here the states change based on the previous order
    if (orderInfo && orderInfo.waitingTimeInMilSec < 0 && !isTripLoading) {
      const waitingTimeInMin = Math.floor(Math.abs(orderInfo.waitingTimeInMilSec) / minToMilSec(1));

      setExtraWaiting(true);
      setExtraSum(waitingTimeInMin * orderInfo.paidWaitingTimeFeePricePerMin);
      setExtraWaitingTimeInSec(waitingTimeInMin * 60);
    }
  }, [orderInfo, isTripLoading]);

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
      currencyCode,
      arrivedToPickUpDate,
      waitingTimeInMilSec,
    } = orderInfo;

    const getTimerStateData = (status: TripStatus | 'waiting'): Nullable<TimerStateDataType> => {
      switch (status) {
        case TripStatus.Idle: {
          //TODO: do estimatedArriveToPickUpDate check
          return {
            timerTime: new Date(estimatedArriveToPickUpDate).getTime(),
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
        case TripStatus.Accepted: {
          //TODO: do estimatedArriveToPickUpDate check
          return {
            timerTime: new Date(estimatedArriveToPickUpDate).getTime(), //TODO change to real data
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
            //TODO: Remove "secToMilSec(1)" when fix a timer
            timerTime: arrivedToPickUpDate
              ? new Date(arrivedToPickUpDate).getTime() + waitingTimeInMilSec - secToMilSec(1)
              : null, // For correct time rendering in timer
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

    const trafficSegments: TrafficIndicatorProps['segments'] = [];
    if (routeTraffic !== null) {
      const lastRouteIndex = routeTraffic[routeTraffic.length - 1].polylineEndIndex;
      routeTraffic.forEach(elem => {
        trafficSegments.push({
          level: trafficLoadFromAPIToTrafficLevel[elem.trafficLoad],
          percent: `${(1 - (elem.polylineEndIndex - elem.polylineStartIndex) / lastRouteIndex) * 100}%`,
        });
      });
    }

    if (tripStatus === TripStatus.Ride) {
      return (
        <>
          <View style={styles.topTitleContainer}>
            {isTripLoading ? (
              <Skeleton skeletonContainerStyle={styles.skeletonNameTime} />
            ) : (
              <>
                <Text style={[styles.nameTimeText, computedStyles.beInAndLvlAmountText]}>
                  {t('ride_Ride_Trip_youBeIn')}{' '}
                </Text>
                <Text style={styles.nameTimeText}>{formatTime(new Date(arrivedTime))}</Text>
              </>
            )}
          </View>
          {isTripLoading ? (
            <Skeleton skeletonContainerStyle={styles.skeletonCarInfoText} />
          ) : (
            <Text style={[styles.carInfoText, styles.carNameAlign]}>{`${carBrand} ${carModel}`}</Text>
          )}
          {isTripLoading ? (
            <Skeleton skeletonContainerStyle={styles.skeletonTraficIndicator} />
          ) : (
            trafficSegments.length !== 0 && (
              <TrafficIndicator
                containerStyle={styles.trafficIndicatorContainer}
                currentPercent={ridePercentFromPolylines}
                segments={trafficSegments}
                startDate={routeStartDate}
                endDate={routeEndDate}
              />
            )
          )}
          <View style={styles.driverInfoWrapper}>
            {isTripLoading ? (
              <View style={styles.driverInfoContainer}>
                <Skeleton skeletonContainerStyle={styles.skeletonAvatar} />
                <View style={styles.skeletonDriverInfoContainer}>
                  <Skeleton skeletonsAmount={2} skeletonContainerStyle={styles.skeletonDriverInfo} />
                </View>
              </View>
            ) : (
              <View style={styles.driverInfoContainer}>
                {contractorAvatar ? (
                  <Image
                    style={styles.driverInfoImage}
                    source={{
                      uri: contractorAvatar,
                    }}
                  />
                ) : (
                  <Image
                    style={[styles.driverInfoImage, computedStyles.defaultAvatar]}
                    source={require('../../../../../assets/images/DefaultAvatar.png')}
                  />
                )}
                <View>
                  <Text style={styles.carInfoText}>{firstName}</Text>
                  <StatsBlock amountLikes={totalLikesCount ?? 0} />
                </View>
              </View>
            )}
            {isTripLoading ? (
              <Skeleton skeletonContainerStyle={styles.skeletonCarNumber} />
            ) : (
              <View style={[styles.plateNumberContainer, computedStyles.plateNumberContainer]}>
                <Text style={styles.carInfoText}>{carNumber}</Text>
              </View>
            )}
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
          {isTripLoading || timerState?.timerTime === null ? (
            <Skeleton skeletonContainerStyle={[styles.skeletonTimer, computedStyles.skeletonTimer]} />
          ) : (
            <View>
              {timerState && (
                <Timer
                  isWaiting={extraWaiting}
                  time={extraWaiting ? extraWaitingTimeInSec : timerState.timerTime}
                  sizeMode={timerSizeMode}
                  colorMode={timerState.mode}
                  onAfterCountdownEnds={onAfterCountdownEndsHandler}
                  countingForwardStartTime={extraWaitingTimeInSec}
                />
              )}

              {timerState?.timerLabel && (
                <View style={[styles.timerLabelContainer, computedStyles.timerLabelContainer]}>
                  <Text style={[styles.timerLabelText, computedStyles.timerLabelText]}>
                    {extraWaiting ? `-${formatCurrency(currencyCode, extraSum)}` : timerState.timerLabel}
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
  skeletonCarInfoText: {
    alignSelf: 'center',
    width: '30%',
    height: 22,
    marginTop: 9,
  },
  skeletonAvatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  skeletonDriverInfoContainer: {
    marginLeft: 8,
    gap: 4,
  },
  skeletonDriverInfo: {
    width: 60,
    height: 17,
  },
  skeletonCarNumber: {
    width: '30%',
    height: 40,
  },
  skeletonTraficIndicator: {
    width: '100%',
    height: 56,
    marginTop: 18,
    borderRadius: 8,
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
