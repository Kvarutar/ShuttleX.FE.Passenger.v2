import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import {
  Bar,
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
import {
  orderInfoSelector,
  orderSelector,
  orderTariffInfoSelector,
  tripStatusSelector,
} from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import { trafficLoadFromAPIToTrafficLevel } from '../../../core/utils';
import Menu from '../../ride/Menu';
import RecentAddressesBar from './RecentAddressesBar';

const recentAddressesAmount = 10;

const ActivityScreen = () => {
  const tariffIconsData = useTariffsIcons();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const ordersHistory = useSelector(ordersHistorySelector);
  const isOrdersHistoryOffsetEmpty = useSelector(isOrdersHistoryOffsetEmptySelector);
  const order = useSelector(orderSelector);
  const orderInfo = useSelector(orderInfoSelector);
  const tripTariff = useSelector(orderTariffInfoSelector);
  const isOrdersHistoryLoading = useSelector(isOrdersHistoryLoadingSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const ridePercentFromPolylines = useSelector(mapRidePercentFromPolylinesSelector);
  const routeTraffic = useSelector(mapRouteTrafficSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [routeStartDate, setRouteStartDate] = useState<Date | undefined>(undefined);
  const [routeEndDate, setRouteEndDate] = useState<Date | undefined>(undefined);
  const [recentAddressesOffset, setRecentAddressesOffset] = useState(1);

  const feRideStatusesByOrderStatus: Record<
    Extract<TripStatus, TripStatus.Accepted | TripStatus.Arrived | TripStatus.Ride>,
    string
  > = {
    accepted: 'menu_Activity_Enroute',
    arrived: 'menu_Activity_Arrived',
    ride: 'menu_Activity_Driving',
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
    emptyActivityText: {
      color: colors.textSecondaryColor,
    },
    emptyActivityWrapper: {
      paddingBottom: sizes.paddingHorizontal,
    },
  });

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

  useEffect(() => {
    if (!orderInfo) {
      return;
    }

    if (tripStatus === TripStatus.Accepted) {
      setRouteStartDate(new Date(orderInfo.createdDate));
      setRouteEndDate(new Date(orderInfo.estimatedArriveToPickUpDate));
    } else if (tripStatus === TripStatus.Ride) {
      setRouteStartDate(new Date(orderInfo.pickUpDate));
      setRouteEndDate(new Date(orderInfo.estimatedArriveToDropOffDate));
    }
  }, [tripStatus, orderInfo]);

  useEffect(() => {
    dispatch(getOrdersHistory({ offset: 0, amount: recentAddressesAmount }));

    return () => {
      dispatch(clearOrdersHistory());
    };
  }, [dispatch]);

  const loadMoreRecentAddresses = () => {
    if (!isOrdersHistoryLoading && !isOrdersHistoryOffsetEmpty) {
      dispatch(getOrdersHistory({ offset: recentAddressesOffset, amount: recentAddressesAmount }));

      setRecentAddressesOffset(value => value + 1);
    }
  };

  const renderActiveRides = (): JSX.Element => {
    if (isOrdersHistoryLoading && ordersHistory.length === 0) {
      return <Skeleton skeletonContainerStyle={styles.skeletonActiveRides} />;
    }
    if (!tripTariff || !order || !orderInfo || tripStatus === TripStatus.Idle || tripStatus === TripStatus.Finished) {
      return (
        <View style={styles.haveNotActiveRidesWrapper}>
          <Text style={[styles.emptyActivityText, computedStyles.emptyActivityText]}>
            {t('menu_Activity_haveNotCurrentRides')}
          </Text>
        </View>
      );
    }

    const TariffImage = tariffIconsData[tariffsNamesByFeKey[tripTariff.feKey]].icon;

    return (
      <Bar style={styles.currentTripContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.avatar}
            source={order.avatar ? { uri: order.avatar } : require('../../../../assets/images/DefaultAvatar.png')}
          />
          <TariffImage style={styles.carImage} />
        </View>
        <View style={styles.additionalInfoContainer}>
          <Text style={[styles.currentTripTitleText, computedStyles.text]}>{t('menu_Activity_activeOrder')}</Text>
          <View style={[styles.statusContainer, computedStyles.statusContainer]}>
            <Text style={[styles.statusText, computedStyles.statusText]}>
              {t(feRideStatusesByOrderStatus[tripStatus])}
            </Text>
          </View>
        </View>
        <View style={styles.contractorInfoContainer}>
          <Text style={styles.nameText}>{orderInfo.firstName}</Text>
          <Text style={[styles.carModelText, computedStyles.text]}>
            {orderInfo.carBrand} {orderInfo.carModel}
          </Text>
        </View>
        {trafficSegments.length !== 0 && (
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

  let content = (
    <>
      {renderActiveRides()}
      {(ordersHistory.length || isOrdersHistoryLoading) && (
        <View style={styles.recentAddressesWrapper}>
          <Text style={[styles.recentAddressesTitleText, computedStyles.text]}>
            {t('menu_Activity_recentAddresses')}
          </Text>
          <View>
            {isOrdersHistoryLoading && ordersHistory.length === 0 ? (
              <Skeleton skeletonsAmount={5} skeletonContainerStyle={styles.skeletonRecentAdress} />
            ) : (
              <FlatList
                contentContainerStyle={styles.recentAddressesContainer}
                showsVerticalScrollIndicator={false}
                data={ordersHistory}
                renderItem={({ item }) => <RecentAddressesBar order={item} />}
                onEndReached={loadMoreRecentAddresses}
                ListFooterComponent={isOrdersHistoryLoading ? <LoadingSpinner /> : <></>}
              />
            )}
          </View>
        </View>
      )}
    </>
  );

  if (!ordersHistory.length && !order && !isOrdersHistoryLoading) {
    content = (
      <View style={[styles.emptyActivityWrapper, computedStyles.emptyActivityWrapper]}>
        <Text style={[styles.emptyActivityText, computedStyles.emptyActivityText]}>
          {t('menu_Activity_emptyActivity')}
        </Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView>
        <MenuHeader onMenuPress={() => setIsMenuVisible(true)}>
          <Text style={styles.headerText}>{t('menu_Activity_title')}</Text>
        </MenuHeader>
        {content}
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const styles = StyleSheet.create({
  skeletonActiveRides: {
    height: 200,
    borderRadius: 12,
    marginVertical: 12,
  },
  skeletonRecentAdress: {
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
  },
  currentTripContainer: {
    padding: 16,
    marginTop: 16,
  },
  carImage: {
    width: '45%',
    height: undefined,
    aspectRatio: 3.3,
    flexShrink: 1,
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
  recentAddressesTitleText: {
    fontSize: 14,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
    marginTop: 16,
    marginBottom: 12,
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
