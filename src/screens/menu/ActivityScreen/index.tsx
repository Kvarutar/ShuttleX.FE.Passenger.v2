import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import {
  Bar,
  GroupedButtons,
  LoadingSpinner,
  MenuHeader,
  SafeAreaView,
  sizes,
  Skeleton,
  Text,
  TrafficIndicator,
  TrafficIndicatorProps,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { clearOrdersHistory } from '../../../core/passenger/redux';
import {
  isOrdersHistoryLoadingSelector,
  isOrdersHistoryOffsetEmptySelector,
  ordersHistorySelector,
} from '../../../core/passenger/redux/selectors';
import { getOrdersHistory } from '../../../core/passenger/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { mapRidePercentFromPolylinesSelector, mapRouteTrafficSelector } from '../../../core/ride/redux/map/selectors';
import { tariffsNamesByFeKey } from '../../../core/ride/redux/offer/utils';
import { setOrderStatus } from '../../../core/ride/redux/order';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { setSelectedOrderId, setTripStatus } from '../../../core/ride/redux/trip';
import { orderSelector, selectedOrderIdSelector } from '../../../core/ride/redux/trip/selectors';
import { getOrderInfo, getRouteInfo } from '../../../core/ride/redux/trip/thunks';
import { OrderWithTariffInfo, TripStateFromAPI } from '../../../core/ride/redux/trip/types';
import { getFETripStatusByBETripState } from '../../../core/ride/redux/trip/utils';
import { trafficLoadFromAPIToTrafficLevel } from '../../../core/utils';
import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';
import RecentAddressesBar from './RecentAddressesBar';
import { RideStatusTranslateKey } from './types';

const recentAddressesAmount = 10;

const rideStatusTranslateKeyByBEOrderState: Record<
  Exclude<TripStateFromAPI, 'None' | 'CompletedSuccessfully' | 'CanceledByPassenger' | 'CanceledByContractor'>,
  RideStatusTranslateKey
> = {
  InPreviousOrder: 'menu_Activity_Enroute',
  MoveToPickUp: 'menu_Activity_Enroute',
  InPickUp: 'menu_Activity_Arrived',
  InStopPoint: 'menu_Activity_Arrived',
  MoveToStopPoint: 'menu_Activity_Driving',
  MoveToDropOff: 'menu_Activity_Driving',
};

const isOrderNotActive = (stateForCheching: TripStateFromAPI | undefined) => {
  return (
    stateForCheching === 'CanceledByContractor' ||
    stateForCheching === 'CanceledByPassenger' ||
    stateForCheching === 'CompletedSuccessfully' ||
    stateForCheching === 'None'
  );
};

const ActivityScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const ordersHistory = useSelector(ordersHistorySelector);
  const isOrdersHistoryOffsetEmpty = useSelector(isOrdersHistoryOffsetEmptySelector);
  const order = useSelector(orderSelector);
  const isOrdersHistoryLoading = useSelector(isOrdersHistoryLoadingSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [recentAddressesOffset, setRecentAddressesOffset] = useState(1);
  const [isFirstButtonSelected, setIsFirstButtonSelected] = useState(true);

  const ordersHistoryFiltered = isFirstButtonSelected
    ? ordersHistory
        .filter(
          orderHistory =>
            orderHistory.info &&
            (orderHistory.info.state === 'MoveToPickUp' ||
              orderHistory.info.state === 'InPickUp' ||
              orderHistory.info.state === 'InPreviousOrder' ||
              orderHistory.info.state === 'MoveToStopPoint' ||
              orderHistory.info.state === 'InStopPoint' ||
              orderHistory.info.state === 'MoveToDropOff'),
        )
        //TODO: Check why order.info might be null
        //Maybe refactor order.info
        .sort((a, b) => {
          const dateA = new Date(a.info?.createdDate || 0).getTime();
          const dateB = new Date(b.info?.createdDate || 0).getTime();
          return dateB - dateA;
        })
    : ordersHistory.filter(orderHistory => isOrderNotActive(orderHistory.info?.state));

  const computedStyles = StyleSheet.create({
    statusContainer: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
    statusText: {
      color: colors.textPrimaryColor,
    },
    text: {
      color: colors.textSecondaryColor,
    },
    emptyActivityText: {
      color: colors.textSecondaryColor,
    },
    emptyActivityWrapper: {
      paddingBottom: sizes.paddingHorizontal,
    },
  });

  useEffect(() => {
    dispatch(getOrdersHistory({ offset: 0, amount: recentAddressesAmount }));

    return () => {
      dispatch(clearOrdersHistory());
    };
  }, [dispatch]);

  const loadMoreRecentAddresses = () => {
    if (!isOrdersHistoryLoading && !isOrdersHistoryOffsetEmpty && !isFirstButtonSelected) {
      dispatch(getOrdersHistory({ offset: recentAddressesOffset, amount: recentAddressesAmount }));

      setRecentAddressesOffset(value => value + 1);
    }
  };

  const renderRideSkeleton = () => {
    if (isFirstButtonSelected) {
      return <Skeleton skeletonsAmount={5} skeletonContainerStyle={styles.skeletonActiveRide} />;
    }
    return <Skeleton skeletonsAmount={5} skeletonContainerStyle={styles.skeletonRecentAdress} />;
  };

  let content = (
    <>
      {(ordersHistoryFiltered.length || isOrdersHistoryLoading) && (
        <View style={styles.recentAddressesWrapper}>
          <View>
            {isOrdersHistoryLoading && ordersHistoryFiltered.length === 0 ? (
              renderRideSkeleton()
            ) : (
              <FlatList
                contentContainerStyle={styles.recentAddressesContainer}
                showsVerticalScrollIndicator={false}
                data={ordersHistoryFiltered}
                renderItem={({ item }) =>
                  isOrderNotActive(item.info?.state) ? (
                    <RecentAddressesBar order={item} />
                  ) : (
                    <ActiveRide activeRide={item} />
                  )
                }
                onEndReached={loadMoreRecentAddresses}
                ListFooterComponent={isOrdersHistoryLoading && !isFirstButtonSelected ? <LoadingSpinner /> : <></>}
              />
            )}
          </View>
        </View>
      )}
    </>
  );

  if (!ordersHistoryFiltered.length && !order && !isOrdersHistoryLoading) {
    content = (
      <View style={[styles.emptyActivityWrapper, computedStyles.emptyActivityWrapper]}>
        <Text style={[styles.emptyActivityText, computedStyles.emptyActivityText]}>
          {isFirstButtonSelected ? t('menu_Activity_haveNotCurrentRides') : t('menu_Activity_emptyActivity')}
        </Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView>
        <MenuHeader style={styles.menuHeader} onMenuPress={() => setIsMenuVisible(true)}>
          <GroupedButtons
            width={200}
            firstButtonText={t('menu_Activity_activeButton')}
            secondButtonText={t('menu_Activity_recentButton')}
            isFirstButtonSelected={isFirstButtonSelected}
            setIsFirstButtonSelected={setIsFirstButtonSelected}
          />
        </MenuHeader>
        {content}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const ActiveRide = ({ activeRide }: { activeRide: OrderWithTariffInfo }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const tariffIconsData = useTariffsIcons();
  const TariffImage = tariffIconsData[tariffsNamesByFeKey[activeRide.tariffInfo.feKey]].icon;

  const ridePercentFromPolylines = useSelector(mapRidePercentFromPolylinesSelector);

  const [routeStartDate, setRouteStartDate] = useState<Date | undefined>(undefined);
  const [routeEndDate, setRouteEndDate] = useState<Date | undefined>(undefined);

  const routeTraffic = useSelector(mapRouteTrafficSelector);
  const selectedOrderId = useSelector(selectedOrderIdSelector);

  useEffect(() => {
    if (!activeRide.info) {
      return;
    }

    if (activeRide.info.state === 'MoveToPickUp') {
      setRouteStartDate(new Date(activeRide.info.createdDate));
      setRouteEndDate(new Date(activeRide.info.estimatedArriveToPickUpDate));
    } else if (activeRide.info.state === 'MoveToDropOff') {
      setRouteStartDate(new Date(activeRide.info.pickUpDate));
      setRouteEndDate(new Date(activeRide.info.estimatedArriveToDropOffDate));
    }
  }, [activeRide]);

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

  const onActiveRidePress = () => {
    if (activeRide.info) {
      dispatch(setTripStatus(getFETripStatusByBETripState(activeRide.info.state)));
      dispatch(setOrderStatus(OrderStatus.StartRide));

      dispatch(getOrderInfo(activeRide.orderId));
      dispatch(getRouteInfo(activeRide.orderId));
      dispatch(setSelectedOrderId(activeRide.orderId));

      //This action kills screens, all logic is processing again
      //It resolves problem with infinity adding loops
      navigation.dispatch(state => {
        return CommonActions.reset({
          ...state,
          routes: [{ name: 'Ride' }], // Start from one screen - "Ride"
          index: 0,
        });
      });
    }
  };

  const computedStyles = StyleSheet.create({
    statusContainer: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
    statusText: {
      color: colors.textPrimaryColor,
    },
    text: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <Bar style={styles.currentTripContainer} onPress={onActiveRidePress} key={activeRide.orderId}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.avatar}
          source={
            activeRide.avatar ? { uri: activeRide.avatar } : require('../../../../assets/images/DefaultAvatar.png')
          }
        />
        <TariffImage style={styles.carImage} />
      </View>
      <View style={styles.additionalInfoContainer}>
        <Text style={[styles.currentTripTitleText, computedStyles.text]}>{t('menu_Activity_activeOrder')}</Text>
        <View style={[styles.statusContainer, computedStyles.statusContainer]}>
          <Text style={[styles.statusText, computedStyles.statusText]}>
            {activeRide.info &&
              activeRide.info.state !== 'CanceledByContractor' &&
              activeRide.info.state !== 'CanceledByPassenger' &&
              activeRide.info.state !== 'CompletedSuccessfully' &&
              activeRide.info.state !== 'None' &&
              t(rideStatusTranslateKeyByBEOrderState[activeRide.info.state])}
          </Text>
        </View>
      </View>
      <View style={styles.contractorInfoContainer}>
        <Text style={styles.nameText}>{activeRide.info?.firstName}</Text>
        <Text style={[styles.carModelText, computedStyles.text]}>
          {activeRide.info?.carBrand} {activeRide.info?.carModel}
        </Text>
      </View>
      {trafficSegments.length !== 0 &&
        activeRide.orderId === selectedOrderId &&
        (activeRide.info?.state === 'MoveToDropOff' || activeRide.info?.state === 'MoveToStopPoint') && (
          <TrafficIndicator
            containerStyle={styles.trafficIndicatorContainer}
            currentPercent={ridePercentFromPolylines}
            segments={trafficSegments}
            startDate={routeStartDate}
            endDate={routeEndDate}
          />
        )}
    </Bar>
  );
};

const styles = StyleSheet.create({
  skeletonActiveRide: {
    width: '100%',
    aspectRatio: 2.5,
    borderRadius: 12,
    marginBottom: 8,
  },
  skeletonRecentAdress: {
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuHeader: {
    marginBottom: 12,
  },
  currentTripContainer: {
    padding: 16,
  },
  carImage: {
    width: '45%',
    height: undefined,
    aspectRatio: 3.3,
    flexShrink: 1,
    resizeMode: 'contain',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  contractorInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  carModelText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  currentTripTitleText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
    letterSpacing: -0.64,
  },
  nameText: {
    fontSize: 21,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  recentAddressesWrapper: {
    flex: 1,
  },
  recentAddressesContainer: {
    gap: 8,
    paddingBottom: 40,
  },
  trafficIndicatorContainer: {
    marginTop: 20,
  },
  haveNotActiveRidesWrapper: {
    paddingVertical: 64,
  },
  emptyActivityWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActivityText: {
    fontSize: 20,
    fontFamily: 'Inter Medium',
    textAlign: 'center',
  },
});

export default ActivityScreen;
