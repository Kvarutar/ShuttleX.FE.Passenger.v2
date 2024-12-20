import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  Skeleton,
  SwipeButton,
  SwipeButtonModes,
  Timer,
  TimerColorModes,
  TimerSizesModes,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import {
  isTripLoadingSelector,
  orderIdSelector,
  orderSelector,
  tripStatusSelector,
} from '../../../../core/ride/redux/trip/selectors';
import {
  cancelTrip,
  getOrderInfo,
  getTripCanceledAfterPickUpLongPolling,
  getTripSuccessfullLongPolling,
} from '../../../../core/ride/redux/trip/thunks';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import { RootStackParamList } from '../../../../Navigate/props';
import AlertInitializer from '../../../../shared/AlertInitializer';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const Trip = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const tariffIconsData = useTariffsIcons();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Ride', undefined>>();

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const orderId = useSelector(orderIdSelector);
  const isTripLoading = useSelector(isTripLoadingSelector);
  const [extraSum, setExtraSum] = useState(0);
  const order = useSelector(orderSelector);

  const arrivedTime = order?.info ? Date.parse(order?.info?.estimatedArriveToDropOffDate) : 0;

  useEffect(() => {
    if (orderId && tripStatus === TripStatus.Ride) {
      dispatch(getTripSuccessfullLongPolling(orderId));
      dispatch(getTripCanceledAfterPickUpLongPolling(orderId));
    }

    if (tripStatus === TripStatus.Finished) {
      navigation.navigate('Rating');
    }
  }, [tripStatus, navigation, orderId, dispatch]);

  const TariffIcon = tariffIconsData.Basic.icon;

  const computedStyles = StyleSheet.create({
    avatarWrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  const onCancelTrip = async () => {
    if (orderId) {
      await dispatch(cancelTrip(orderId));
      dispatch(getOrderInfo(orderId));
    }
  };

  const headerElementBlock =
    tripStatus === TripStatus.Ride ? (
      <Timer
        style={{ timerWrapper: styles.timerWrapper }}
        time={arrivedTime}
        sizeMode={TimerSizesModes.S}
        colorMode={TimerColorModes.Mode3}
      />
    ) : (
      <View style={styles.imageContainer}>
        <TariffIcon style={styles.carImage} />
        <View style={[styles.avatarWrapper, computedStyles.avatarWrapper]}>
          {isTripLoading ? (
            <Skeleton skeletonContainerStyle={styles.skeletonAvatar} />
          ) : (
            <Image
              style={styles.avatar}
              source={{
                uri: order?.avatar ?? undefined, //TODO: change to default image
              }}
            />
          )}
        </View>
      </View>
    );

  return (
    <BottomWindowWithGesture
      maxHeight={0.88}
      withDraggable={!TripStatus.Ride}
      headerWrapperStyle={styles.headerWrapperStyle}
      headerElement={headerElementBlock}
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
      hiddenPartButton={
        <SwipeButton
          mode={SwipeButtonModes.Decline}
          onSwipeEnd={onCancelTrip}
          text={t('ride_Ride_Trip_cancelRideButton')}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  skeletonAvatar: {
    borderRadius: 1000,
  },
  visiblePartStyle: {
    marginBottom: 16,
    paddingTop: 5,
  },
  headerWrapperStyle: {
    height: 40,
    justifyContent: 'flex-end',
    marginBottom: 20,
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
});

export default Trip;
