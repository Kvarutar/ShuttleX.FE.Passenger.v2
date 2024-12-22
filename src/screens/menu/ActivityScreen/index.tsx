import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import {
  Bar,
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

import { isOrdersHistoryLoadingSelector, ordersHistorySelector } from '../../../core/passenger/redux/selectors';
import { getOrdersHistory } from '../../../core/passenger/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { mapRidePercentFromPolylinesSelector, mapRouteTrafficSelector } from '../../../core/ride/redux/map/selectors';
import { tariffByIdSelector } from '../../../core/ride/redux/offer/selectors';
import { orderSelector, tripStatusSelector } from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import { trafficLoadFromAPIToTrafficLevel } from '../../../core/utils';
import Menu from '../../ride/Menu';
import RecentAddressesBar from './RecentAddressesBar';

const ActivityScreen = () => {
  const tariffIconsData = useTariffsIcons();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const ordersHistory = useSelector(ordersHistorySelector);
  const currentOrder = useSelector(orderSelector);
  const tripTariff = useSelector(state => tariffByIdSelector(state, currentOrder?.info?.tariffId));
  const isOrdersHistoryLoading = useSelector(isOrdersHistoryLoadingSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const ridePercentFromPolylines = useSelector(mapRidePercentFromPolylinesSelector);
  const routeTraffic = useSelector(mapRouteTrafficSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [routeStartDate, setRouteStartDate] = useState<Date | undefined>(undefined);
  const [routeEndDate, setRouteEndDate] = useState<Date | undefined>(undefined);

  const computedStyles = StyleSheet.create({
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
    if (!currentOrder?.info) {
      return;
    }

    if (tripStatus === TripStatus.Accepted) {
      setRouteStartDate(new Date(currentOrder.info.createdDate));
      setRouteEndDate(new Date(currentOrder.info.estimatedArriveToPickUpDate));
    } else if (tripStatus === TripStatus.Ride) {
      setRouteStartDate(new Date(currentOrder.info.pickUpDate));
      setRouteEndDate(new Date(currentOrder.info.estimatedArriveToDropOffDate));
    }
  }, [tripStatus, currentOrder?.info]);

  useEffect(() => {
    dispatch(getOrdersHistory());
  }, [dispatch]);

  const renderActiveRides = (): JSX.Element => {
    if (isOrdersHistoryLoading) {
      return <Skeleton skeletonContainerStyle={styles.skeletonActiveRides} />;
    }
    if (!tripTariff || !currentOrder || !currentOrder.info) {
      return (
        <View style={styles.haveNotActiveRidesWrapper}>
          <Text style={[styles.emptyActivityText, computedStyles.emptyActivityText]}>
            {t('menu_Activity_haveNotCurrentRides')}
          </Text>
        </View>
      );
    }

    const TariffImage = tariffIconsData[tripTariff.name].icon;

    return (
      <Bar style={styles.currentTripContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.avatar}
            source={
              currentOrder.avatar
                ? { uri: currentOrder.avatar }
                : require('../../../../assets/images/DefaultAvatar.png')
            }
          />
          <TariffImage style={styles.carImage} />
        </View>
        <Text style={[styles.currentTripTitleText, computedStyles.text]}>{t('menu_Activity_activeOrder')}</Text>
        <View style={styles.contractorInfoContainer}>
          <Text style={styles.nameText}>{currentOrder.info.firstName}</Text>
          <Text style={[styles.carModelText, computedStyles.text]}>
            {currentOrder.info.carBrand} {currentOrder.info.carModel}
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.recentAddressesContainer}>
              {isOrdersHistoryLoading ? (
                <Skeleton skeletonsAmount={5} skeletonContainerStyle={styles.skeletonRecentAdress} />
              ) : (
                ordersHistory.map((order, index) => <RecentAddressesBar key={index} order={order} />)
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );

  if (!ordersHistory.length && !currentOrder && !isOrdersHistoryLoading) {
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
