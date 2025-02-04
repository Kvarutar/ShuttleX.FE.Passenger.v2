import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LatLng } from 'react-native-maps';
import { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  calculateNewMapRoute,
  decodeGooglePolyline,
  getDistanceBetweenPoints,
  getTimeWithAbbreviation,
  MapMarker,
  MapPolyline,
  MapView as MapViewIntegration,
  MapViewRef,
  MarkerTypeWithLabel,
  Nullable,
  secToMilSec,
} from 'shuttlex-integration';

import { activeBottomWindowYCoordinateSelector } from '../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { updatePassengerGeo } from '../../../core/redux/signalr';
import {
  geolocationCalculatedHeadingSelector,
  geolocationCoordinatesSelector,
} from '../../../core/ride/redux/geolocation/selectors';
import { setMapCameraMode, setMapRidePercentFromPolylines, setMapRouteTraffic } from '../../../core/ride/redux/map';
import { mapCameraModeSelector, mapCarsSelector, mapStopPointsSelector } from '../../../core/ride/redux/map/selectors';
import {
  currentSelectedTariffSelector,
  offerPointsSelector,
  offerRoutesSelector,
} from '../../../core/ride/redux/offer/selectors';
import { orderStatusSelector } from '../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import {
  orderIdSelector,
  tripDropOffRouteSelector,
  tripPickUpRouteSelector,
  tripStatusSelector,
} from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';

const updatePassengerGeoInterval = 1000;
const finalStopPointUpdateIntervalInSec = 30;
const polylineClearPointDistanceMtr = 25;
const mapResizeAnimationDuration = 200;

const screenHeight = Dimensions.get('screen').height;

const MapView = ({ onFirstCameraAnimationComplete }: { onFirstCameraAnimationComplete: () => void }): JSX.Element => {
  const dispatch = useAppDispatch();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const geolocationCalculatedHeading = useSelector(geolocationCalculatedHeadingSelector);
  const stopPoints = useSelector(mapStopPointsSelector);
  const cameraMode = useSelector(mapCameraModeSelector);
  const cars = useSelector(mapCarsSelector);
  const orderId = useSelector(orderIdSelector);
  const orderStatus = useSelector(orderStatusSelector);
  const offerPoints = useSelector(offerPointsSelector);
  const offerRoutes = useSelector(offerRoutesSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const pickUpRoute = useSelector(tripPickUpRouteSelector);
  const dropOffRoute = useSelector(tripDropOffRouteSelector);
  const currentSelectedTariff = useSelector(currentSelectedTariffSelector);
  const activeBottomWindowYCoordinate = useSelector(activeBottomWindowYCoordinateSelector);

  const updatePassengerGeoRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapViewRef>(null);
  const geolocationCoordinatesRef = useRef<Nullable<LatLng>>(null);

  useEffect(() => {
    geolocationCoordinatesRef.current = geolocationCoordinates;
  }, [geolocationCoordinates]);

  const [polyline, setPolyline] = useState<MapPolyline | null>(null);
  const [routePolylinePointsCount, setRoutePolylinePointsCount] = useState<number>(0);
  const [finalStopPointCoordinates, setFinalStopPointCoordinates] = useState<LatLng | null>(null);
  const [finalStopPointTimeInSec, setFinalStopPointTimeInSec] = useState<number>(0);
  const [finalStopPointColorMode, setFinalStopPointColorMode] = useState<MarkerTypeWithLabel['colorMode']>('mode1');
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [mapCameraCoordinates, setMapCameraCoordinates] = useState<LatLng | null>(null);

  const memoizedPolyline = useMemo(() => (polyline ? [polyline] : undefined), [polyline]);

  // Section: getting geo of contractors and send geo of passenger
  const setUpdatePassengerGeoInterval = (callback: () => void) => {
    if (updatePassengerGeoRef.current !== null) {
      clearInterval(updatePassengerGeoRef.current);
    }
    updatePassengerGeoRef.current = setInterval(callback, updatePassengerGeoInterval);
  };

  // Clear interval on dismount
  useEffect(() => {
    return () => {
      if (updatePassengerGeoRef.current) {
        clearInterval(updatePassengerGeoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (orderId) {
      setUpdatePassengerGeoInterval(() => {
        dispatch(
          updatePassengerGeo({
            position: geolocationCoordinatesRef.current,
            state: 'InOrder',
            orderId: orderId,
          }),
        );
      });
    } else if (orderStatus === OrderStatus.Confirming) {
      setUpdatePassengerGeoInterval(() => {
        dispatch(
          updatePassengerGeo({
            position: null,
            state: 'InThinking',
            orderId: null,
          }),
        );
      });
    }
  }, [dispatch, orderStatus, orderId]);

  useEffect(() => {
    if (tripStatus === TripStatus.Idle && orderStatus !== OrderStatus.Confirming) {
      setUpdatePassengerGeoInterval(() => {
        dispatch(
          updatePassengerGeo({
            position: mapCameraCoordinates,
            state: 'InRadius',
            orderId: null,
          }),
        );
      });
    }
  }, [dispatch, tripStatus, orderStatus, mapCameraCoordinates]);

  // Section: polylines
  const resetPoints = useCallback(() => {
    setPolyline(null);
    setFinalStopPointCoordinates(null);
  }, []);

  // Polyline clearing from moving car
  useEffect(() => {
    switch (tripStatus) {
      case TripStatus.Accepted:
        setPolyline(prev => {
          const type: MapPolyline['type'] = 'dashed';
          if (prev && prev.type === type && cars.length > 0) {
            const newCoordinates = calculateNewMapRoute(
              prev.options.coordinates,
              cars[0].coordinates,
              polylineClearPointDistanceMtr,
            );
            return { type, options: { coordinates: newCoordinates, color: '#ABC736' } };
          }
          return prev;
        });
        break;
      case TripStatus.Ride:
        setPolyline(prev => {
          const type: MapPolyline['type'] = 'straight';
          if (prev && prev.type === type && cars.length > 0) {
            const newCoordinates = calculateNewMapRoute(
              prev.options.coordinates,
              cars[0].coordinates,
              polylineClearPointDistanceMtr,
            );
            return { type, options: { coordinates: newCoordinates } };
          }
          return prev;
        });
        break;
      default:
        break;
    }
  }, [tripStatus, cars]);

  useEffect(() => {
    if (polyline && polyline.type !== 'arc') {
      dispatch(
        setMapRidePercentFromPolylines(
          `${Math.floor((1 - polyline.options.coordinates.length / routePolylinePointsCount) * 100)}%`,
        ),
      );
    }
  }, [dispatch, polyline, routePolylinePointsCount]);

  // Section: Markers
  useEffect(() => {
    const startOfferPoint = offerPoints[0];
    if (orderStatus === OrderStatus.Confirming && tripStatus === TripStatus.Idle) {
      mapRef.current?.animateCamera(
        {
          pitch: 0,
          heading: 0,
          center: { latitude: startOfferPoint.latitude, longitude: startOfferPoint.longitude },
          zoom: 12, // approximately 9km diameter
        },
        { duration: 1500 },
      );
      setMarkers([
        {
          type: 'simple',
          colorMode: 'mode1',
          coordinates: { latitude: startOfferPoint.latitude, longitude: startOfferPoint.longitude },
          zIndex: -1,
        },
      ]);
    } else if ((orderStatus === OrderStatus.ChoosingTariff || orderStatus === OrderStatus.Payment) && offerRoutes) {
      const pickUpPoint = offerRoutes.waypoints[0].geo;
      const dropOffPoint = offerRoutes.waypoints[offerRoutes.waypoints.length - 1].geo;

      setPolyline({
        type: 'dashed',
        options: { coordinates: decodeGooglePolyline(offerRoutes.geometry), color: '#ABC736' },
      });
      setMarkers([{ type: 'simple', colorMode: 'mode1', coordinates: pickUpPoint, zIndex: -1 }]);
      setFinalStopPointCoordinates(dropOffPoint);
      setFinalStopPointColorMode('mode2');

      let ratio = 35;
      if (orderStatus === OrderStatus.Payment) {
        ratio = 40;
      }
      if (mapRef.current) {
        const delta = getDistanceBetweenPoints(pickUpPoint, dropOffPoint) / (ratio * 1000);
        mapRef.current.animateToRegion(
          {
            latitude: (pickUpPoint.latitude + dropOffPoint.latitude) / 2,
            longitude: (pickUpPoint.longitude + dropOffPoint.longitude) / 2,
            latitudeDelta: delta,
            longitudeDelta: delta,
          },
          700,
        );
      }
    } else {
      setMarkers([]);
    }
  }, [orderStatus, offerPoints, offerRoutes, tripStatus]);

  useEffect(() => {
    switch (tripStatus) {
      case TripStatus.Accepted: {
        if (!pickUpRoute) {
          break;
        }
        const coordinates = decodeGooglePolyline(pickUpRoute.geometry); // TODO: check, maybe need to reverse array
        setRoutePolylinePointsCount(coordinates.length);
        setPolyline({ type: 'dashed', options: { coordinates, color: '#ABC736' } });

        setMarkers([{ type: 'simple', colorMode: 'mode1', coordinates: coordinates[coordinates.length - 1] }]);

        dispatch(setMapRouteTraffic(pickUpRoute.accurateGeometries));
        break;
      }
      case TripStatus.Ride: {
        if (!dropOffRoute) {
          break;
        }
        const coordinates = decodeGooglePolyline(dropOffRoute.geometry);
        setRoutePolylinePointsCount(coordinates.length);
        setPolyline({ type: 'straight', options: { coordinates } });

        setFinalStopPointCoordinates(coordinates[coordinates.length - 1]);
        setFinalStopPointTimeInSec(dropOffRoute.totalDurationSec);
        setFinalStopPointColorMode('mode1');

        dispatch(setMapRouteTraffic(dropOffRoute.accurateGeometries));
        break;
      }
      case TripStatus.Idle:
      case TripStatus.Arrived:
        if (orderStatus === OrderStatus.ChoosingTariff || orderStatus === OrderStatus.Payment) {
          break;
        }
        resetPoints();
        break;
      default:
    }
  }, [dispatch, tripStatus, orderStatus, pickUpRoute, dropOffRoute, resetPoints]);

  //TODO: dumb logic while backend don't have normal way for algorythms
  useEffect(() => {
    if (orderStatus === OrderStatus.ChoosingTariff && offerRoutes) {
      if (currentSelectedTariff?.time) {
        setFinalStopPointTimeInSec(offerRoutes.totalDurationSec + currentSelectedTariff.time);
      } else {
        setFinalStopPointTimeInSec(offerRoutes.totalDurationSec);
      }
    }
  }, [orderStatus, offerRoutes, currentSelectedTariff]);

  // Section: final stop point time updating
  useEffect(() => {
    if (orderStatus === OrderStatus.ChoosingTariff || orderStatus === OrderStatus.Payment) {
      return;
    }

    const interval = setInterval(() => {
      setFinalStopPointTimeInSec(prev => {
        if (prev < finalStopPointUpdateIntervalInSec) {
          clearInterval(interval);
          return 0;
        }
        return prev - finalStopPointUpdateIntervalInSec;
      });
    }, secToMilSec(finalStopPointUpdateIntervalInSec));

    return () => {
      clearInterval(interval);
    };
  }, [finalStopPointCoordinates, orderStatus]);

  const finalStopPointTimeWithAbbreviation = useMemo(
    () => getTimeWithAbbreviation(finalStopPointTimeInSec),
    [finalStopPointTimeInSec],
  );

  const mapAnimatedStyle = useAnimatedStyle(() => ({
    bottom: withTiming(activeBottomWindowYCoordinate ? screenHeight - activeBottomWindowYCoordinate - 32 : 0, {
      duration: mapResizeAnimationDuration,
      easing: Easing.linear,
    }),
  }));

  return (
    <MapViewIntegration
      ref={mapRef}
      style={[styles.map, mapAnimatedStyle]}
      // Hide current geolocation if in Accepted or Ride status
      geolocationCoordinates={
        tripStatus === TripStatus.Accepted || tripStatus === TripStatus.Ride
          ? undefined
          : (geolocationCoordinates ?? undefined)
      }
      geolocationCalculatedHeading={geolocationCalculatedHeading}
      // TODO: * 0.85 - temporary solution, need to make smart waiting of finishing previous animation and then start next
      // (maybe drop few animations if queue is too big)
      // or alternatively do the next request when animation is done (or few miliseconds before ending)
      // TODO: it's bug - animationDuration is dont change anything ;(
      cars={{ data: cars, animationDuration: 0 }}
      polylines={memoizedPolyline}
      stopPoints={stopPoints}
      markers={
        finalStopPointCoordinates
          ? [
              ...markers,
              {
                type: 'withLabel',
                colorMode: finalStopPointColorMode,
                coordinates: finalStopPointCoordinates,
                title: finalStopPointTimeWithAbbreviation.value,
                subtitle: finalStopPointTimeWithAbbreviation.label,
              },
            ]
          : markers
      }
      cameraMode={cameraMode}
      setCameraModeOnDrag={mode => dispatch(setMapCameraMode(mode))}
      onDragComplete={setMapCameraCoordinates}
      onFirstCameraAnimationComplete={onFirstCameraAnimationComplete}
      withCarsThinkingAnimation={orderStatus === OrderStatus.Confirming && tripStatus === TripStatus.Idle}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});

export default MapView;
