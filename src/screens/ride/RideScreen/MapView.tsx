import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  calculateNewMapRoute,
  decodeGooglePolyline,
  getTimeWithAbbreviation,
  MapMarker,
  MapPolyline,
  MapView as MapViewIntegration,
  MapViewRef,
  Nullable,
  secToMilSec,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { updatePassengerGeo } from '../../../core/redux/signalr';
import {
  geolocationCalculatedHeadingSelector,
  geolocationCoordinatesSelector,
} from '../../../core/ride/redux/geolocation/selectors';
import { setMapCameraMode, setMapRidePercentFromPolylines, setMapRouteTraffic } from '../../../core/ride/redux/map';
import { mapCameraModeSelector, mapCarsSelector, mapStopPointsSelector } from '../../../core/ride/redux/map/selectors';
import { offerPointsSelector, offerRoutesSelector } from '../../../core/ride/redux/offer/selectors';
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
const polylineClearPointDistanceMtr = 20;

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
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [mapCameraCoordinates, setMapCameraCoordinates] = useState<LatLng | null>(null);

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

  useEffect(() => {
    switch (tripStatus) {
      case TripStatus.Accepted:
        if (!pickUpRoute) {
          break;
        }
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
          const coordinates = decodeGooglePolyline(pickUpRoute.geometry); // TODO: check, maybe need to reverse array
          setRoutePolylinePointsCount(coordinates.length);
          setMarkers([{ colorMode: 'mode1', coordinates: coordinates[coordinates.length - 1] }]);
          dispatch(setMapRouteTraffic(pickUpRoute.accurateGeometries));
          return { type, options: { coordinates } };
        });
        break;
      case TripStatus.Ride:
        if (!dropOffRoute) {
          break;
        }
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
          const coordinates = decodeGooglePolyline(dropOffRoute.geometry);
          setRoutePolylinePointsCount(coordinates.length);
          setFinalStopPointCoordinates(coordinates[coordinates.length - 1]);
          setFinalStopPointTimeInSec(dropOffRoute.totalDurationSec);
          dispatch(setMapRouteTraffic(dropOffRoute.accurateGeometries));
          return { type, options: { coordinates } };
        });
        break;
      case TripStatus.Idle:
      case TripStatus.Arrived:
        if (orderStatus === OrderStatus.ChoosingTariff || orderStatus === OrderStatus.Payment) {
          break;
        }
        resetPoints();
        break;
      default:
    }
  }, [dispatch, tripStatus, orderStatus, pickUpRoute, dropOffRoute, cars, resetPoints]);

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
      setMarkers([
        { colorMode: 'mode1', coordinates: pickUpPoint, zIndex: -1 },
        { colorMode: 'mode2', coordinates: dropOffPoint, zIndex: -1 },
      ]);
      //TODO: make camera animate to route (not just 1 point), or (better) to resize MapView according to bottomwindow
      mapRef.current?.animateCamera({ pitch: 0, heading: 0, center: pickUpPoint, zoom: 15 }, { duration: 700 });
    } else {
      setMarkers([]);
    }
  }, [orderStatus, offerPoints, offerRoutes, tripStatus]);

  // Section: final stop point time updating
  useEffect(() => {
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
  }, [finalStopPointCoordinates]);

  const finalStopPointTimeWithAbbreviation = useMemo(
    () => getTimeWithAbbreviation(finalStopPointTimeInSec),
    [finalStopPointTimeInSec],
  );

  return (
    <MapViewIntegration
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      // Hide current geolocation if in Accepted or Ride status
      geolocationCoordinates={
        tripStatus === TripStatus.Accepted || tripStatus === TripStatus.Ride
          ? undefined
          : geolocationCoordinates ?? undefined
      }
      geolocationCalculatedHeading={geolocationCalculatedHeading}
      // TODO: * 0.85 - temporary solution, need to make smart waiting of finishing previous animation and then start next
      // (maybe drop few animations if queue is too big)
      // or alternatively do the next request when animation is done (or few miliseconds before ending)
      cars={{ data: cars, animationDuration: updatePassengerGeoInterval * 0.85 }}
      polylines={polyline ? [polyline] : undefined}
      finalStopPoint={
        finalStopPointCoordinates
          ? {
              coordinates: finalStopPointCoordinates,
              title: finalStopPointTimeWithAbbreviation.value,
              subtitle: finalStopPointTimeWithAbbreviation.label,
            }
          : undefined
      }
      stopPoints={stopPoints}
      markers={markers}
      cameraMode={cameraMode}
      setCameraModeOnDrag={mode => dispatch(setMapCameraMode(mode))}
      onDragComplete={setMapCameraCoordinates}
      onFirstCameraAnimationComplete={onFirstCameraAnimationComplete}
    />
  );
};

export default MapView;
