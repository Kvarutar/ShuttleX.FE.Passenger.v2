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
  TrafficLevel,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { isOrdersHistoryLoadingSelector, ordersHistorySelector } from '../../../core/passenger/redux/selectors';
import { getOrdersHistory } from '../../../core/passenger/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { tariffByIdSelector } from '../../../core/ride/redux/offer/selectors';
import { orderSelector } from '../../../core/ride/redux/trip/selectors';
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

  const [isMenuVisible, setIsMenuVisible] = useState(false);

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

  //TODO: For test, delete after connect with back
  const [currentDistance, setCurrentDistance] = useState(0);
  const totalDistance = 100;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDistance(prevDistance => {
        const newDistance = prevDistance + 10;
        return Math.min(newDistance, totalDistance);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

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
        {/*TODO: delete mock data*/}
        <TrafficIndicator
          containerStyle={styles.trafficIndicatorContainer}
          currentPercent={`${currentDistance}%`}
          segments={[
            { percent: '15%', level: TrafficLevel.Low },
            { percent: '15%', level: TrafficLevel.Average },
            { percent: '30%', level: TrafficLevel.High },
            { percent: '40%', level: TrafficLevel.Low },
          ]}
          startTime={43200}
          endTime={45000}
        />
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
        <MenuHeader onMenuPress={() => setIsMenuVisible(true)} onNotificationPress={() => {}}>
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
