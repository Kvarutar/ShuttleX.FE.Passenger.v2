import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  Button,
  ButtonShapes,
  CircleButtonModes,
  RouteIcon,
  Skeleton,
  SwipeButton,
  SwipeButtonModes,
  Timer,
  TimerColorModes,
  timerSizes,
  TimerSizesModes,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { useMap } from '../../../../core/map/mapContext';
import { setActiveBottomWindowYCoordinate } from '../../../../core/passenger/redux';
import { activeBottomWindowYCoordinateSelector } from '../../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { tariffsNamesByFeKey } from '../../../../core/ride/redux/offer/utils';
import {
  isTripCanceledLoadingSelector,
  isTripCanceledSelector,
  isTripLoadingSelector,
  orderIdSelector,
  orderSelector,
  orderTariffInfoSelector,
  tripStatusSelector,
} from '../../../../core/ride/redux/trip/selectors';
import { cancelTrip } from '../../../../core/ride/redux/trip/thunks';
import { TripStatus } from '../../../../core/ride/redux/trip/types';
import { RootStackParamList } from '../../../../Navigate/props';
import AlertInitializer from '../../../../shared/AlertInitializer';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const timerSizeMode = TimerSizesModes.S;

const Trip = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Ride', undefined>>();
  const { colors } = useTheme();
  const tariffIconsData = useTariffsIcons();
  const { fitToPolyline } = useMap();

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const orderId = useSelector(orderIdSelector);
  const isTripLoading = useSelector(isTripLoadingSelector);
  const isTripCanceled = useSelector(isTripCanceledSelector);
  const isTripCanceledLoading = useSelector(isTripCanceledLoadingSelector);
  const order = useSelector(orderSelector);
  const tripTariff = useSelector(orderTariffInfoSelector);
  const activeBottomWindowYCoordinate = useSelector(activeBottomWindowYCoordinateSelector);

  const arrivedTime = order?.info ? Date.parse(order?.info?.estimatedArriveToDropOffDate) : 0;
  const TariffIcon = tripTariff?.name ? tariffIconsData[tariffsNamesByFeKey[tripTariff.feKey]].icon : null;

  const computedStyles = StyleSheet.create({
    skeletonTimer: {
      width: timerSizes[timerSizeMode].timerSize,
      height: timerSizes[timerSizeMode].timerSize,
    },
    avatarWrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  useEffect(() => {
    setTimeout(() => fitToPolyline({ onlyWhenCarGeoAvailable: true }), 0);
  }, [fitToPolyline, tripStatus, activeBottomWindowYCoordinate]);

  useEffect(() => {
    if (tripStatus === TripStatus.Finished && !isTripCanceledLoading) {
      if (isTripCanceled) {
        navigation.navigate('Receipt');
      } else {
        navigation.navigate('Rating');
      }
    }
  }, [tripStatus, navigation, orderId, dispatch, isTripCanceled, isTripCanceledLoading]);

  const onCancelTrip = async () => {
    if (orderId) {
      await dispatch(cancelTrip(orderId));
    }
  };

  const headerElementBlock =
    tripStatus === TripStatus.Ride ? (
      isTripLoading ? (
        <Skeleton skeletonContainerStyle={[styles.skeletonTimer, computedStyles.skeletonTimer]} />
      ) : (
        <Timer
          style={{ timerWrapper: styles.timerWrapper }}
          time={arrivedTime}
          sizeMode={timerSizeMode}
          colorMode={TimerColorModes.Mode3}
        />
      )
    ) : (
      TariffIcon !== null && (
        <View style={styles.imageContainer}>
          <TariffIcon style={styles.carImage} />
          <View style={[styles.avatarWrapper, computedStyles.avatarWrapper]}>
            {isTripLoading ? (
              <Skeleton skeletonContainerStyle={styles.skeletonAvatar} />
            ) : order?.avatar ? (
              <Image style={styles.avatar} source={{ uri: order.avatar }} />
            ) : (
              <Image style={styles.defaultAvatar} source={require('../../../../../assets/images/DefaultAvatar.png')} />
            )}
          </View>
        </View>
      )
    );

  return (
    <BottomWindowWithGesture
      onAnimationEnd={values => dispatch(setActiveBottomWindowYCoordinate(values.pageY))}
      onGestureStart={event => {
        if (event.velocityY > 0) {
          dispatch(setActiveBottomWindowYCoordinate(null));
        }
      }}
      onHiddenOrVisibleHeightChange={values => {
        if (!values.isWindowAnimating) {
          dispatch(setActiveBottomWindowYCoordinate(values.pageY));
        }
      }}
      maxHeight={0.88}
      withDraggable={!TripStatus.Ride}
      headerWrapperStyle={styles.headerWrapperStyle}
      headerElement={headerElementBlock}
      withAllPartsScroll
      withHiddenPartScroll={false}
      additionalTopContent={
        <Button
          style={styles.routeButton}
          onPress={fitToPolyline}
          mode={CircleButtonModes.Mode2}
          shape={ButtonShapes.Circle}
          withBorder={false}
        >
          <RouteIcon />
        </Button>
      }
      alerts={alerts.map(alertData => (
        <AlertInitializer
          key={alertData.id}
          id={alertData.id}
          priority={alertData.priority}
          type={alertData.type}
          options={'options' in alertData ? alertData.options : undefined}
        />
      ))}
      visiblePart={<VisiblePart />}
      hiddenPart={<HiddenPart />}
      visiblePartWrapperStyle={styles.visiblePartWrapperStyle}
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
  skeletonTimer: {
    borderRadius: 100,
    alignSelf: 'center',
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
  carImage: {
    resizeMode: 'contain',
    width: '65%',
    height: undefined,
    aspectRatio: 3.1,
  },
  avatarWrapper: {
    padding: 3,
    borderRadius: 100,
    position: 'absolute',
    right: 25,
    width: 72,
    height: 72,
  },
  defaultAvatar: {
    flex: 1,
    width: '100%',
  },
  skeletonAvatar: {
    borderRadius: 1000,
  },
  avatar: {
    flex: 1,
    objectFit: 'contain',
    borderRadius: 100,
  },
  headerWrapperStyle: {
    height: 40,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  routeButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  visiblePartWrapperStyle: {
    marginBottom: 16,
    paddingTop: 5,
  },
});

export default Trip;
