import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
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
import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { mapCarsSelector } from '../../../../core/ride/redux/map/selectors';
import { tariffsNamesByFeKey } from '../../../../core/ride/redux/offer/utils';
import {
  isTripCanceledLoadingSelector,
  isTripCanceledSelector,
  isTripLoadingSelector,
  orderIdSelector,
  orderSelector,
  orderTariffInfoSelector,
  tripDropOffRouteLastWaypointSelector,
  tripPickUpRouteLastWaypointSelector,
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
  const { mapRef } = useMap();

  const contractorCarCoordinatesRef = useRef<LatLng | null>(null);
  const [isContractorCarCoordinatesAvailable, setIsContractorCarCoordinatesAvailable] = useState<boolean>(false);

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const orderId = useSelector(orderIdSelector);
  const isTripLoading = useSelector(isTripLoadingSelector);
  const isTripCanceled = useSelector(isTripCanceledSelector);
  const isTripCanceledLoading = useSelector(isTripCanceledLoadingSelector);
  const order = useSelector(orderSelector);
  const tripTariff = useSelector(orderTariffInfoSelector);
  const tripPickUpRouteLastWaypoint = useSelector(tripPickUpRouteLastWaypointSelector);
  const tripDropOffRouteLastWaypoint = useSelector(tripDropOffRouteLastWaypointSelector);
  const mapCars = useSelector(mapCarsSelector);

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

  // contractorCarCoordinatesRef only needed to avoid putting it inside the useEffect hook below
  useEffect(() => {
    contractorCarCoordinatesRef.current = mapCars.length > 0 ? mapCars[0].coordinates : null;
    if (mapCars.length > 0) {
      contractorCarCoordinatesRef.current = mapCars[0].coordinates;
      setIsContractorCarCoordinatesAvailable(true);
    } else {
      contractorCarCoordinatesRef.current = null;
      setIsContractorCarCoordinatesAvailable(false);
    }
  }, [mapCars]);

  useEffect(() => {
    // If contractor geo not available - dont zoom
    if (!contractorCarCoordinatesRef.current) {
      return;
    }

    const coordinates: LatLng[] = [contractorCarCoordinatesRef.current];
    if (tripStatus === TripStatus.Accepted && tripPickUpRouteLastWaypoint) {
      // Contarctor -> Pickup
      coordinates.push(tripPickUpRouteLastWaypoint.geo);
    } else if (tripStatus === TripStatus.Ride && tripDropOffRouteLastWaypoint) {
      // Pickup -> DropOff
      coordinates.push(tripDropOffRouteLastWaypoint.geo);
    }

    mapRef.current?.fitToCoordinates(coordinates);
  }, [
    mapRef,
    isContractorCarCoordinatesAvailable,
    tripStatus,
    tripPickUpRouteLastWaypoint,
    tripDropOffRouteLastWaypoint,
  ]);

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
  skeletonTimer: {
    borderRadius: 100,
    alignSelf: 'center',
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
    resizeMode: 'contain',
    width: '65%',
    height: undefined,
    aspectRatio: 3.1,
  },
});

export default Trip;
