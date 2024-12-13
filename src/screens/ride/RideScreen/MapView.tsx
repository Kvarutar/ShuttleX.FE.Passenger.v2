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
import { setMapCameraMode } from '../../../core/ride/redux/map';
import { mapCameraModeSelector, mapCarsSelector, mapStopPointsSelector } from '../../../core/ride/redux/map/selectors';
import { offerPointsSelector } from '../../../core/ride/redux/offer/selectors';
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
const polylineClearPointDistanceMtr = 15;

const MapView = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const geolocationCalculatedHeading = useSelector(geolocationCalculatedHeadingSelector);
  const stopPoints = useSelector(mapStopPointsSelector);
  const cameraMode = useSelector(mapCameraModeSelector);
  const cars = useSelector(mapCarsSelector);
  const orderId = useSelector(orderIdSelector);
  const orderStatus = useSelector(orderStatusSelector);
  const offerPoints = useSelector(offerPointsSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const pickUpRoute = useSelector(tripPickUpRouteSelector);
  const dropOffRoute = useSelector(tripDropOffRouteSelector);

  const updatePassengerGeoRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapViewRef>(null);
  const geolocationCoordinatesRef = useRef<Nullable<LatLng>>(null);

  useEffect(() => {
    geolocationCoordinatesRef.current = geolocationCoordinates;
  }, [geolocationCoordinates]);

  const [polyline, setPolyline] = useState<Nullable<MapPolyline>>(null);
  const [finalStopPointCoordinates, setFinalStopPointCoordinates] = useState<Nullable<LatLng>>(null);
  const [finalStopPointTimeInSec, setFinalStopPointTimeInSec] = useState<number>(0);
  const [marker, setMarker] = useState<Nullable<MapMarker>>(null);
  const [mapCameraCoordinates, setMapCameraCoordinates] = useState<Nullable<LatLng>>(null);

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
    const startOfferPoint = offerPoints[0];
    if (orderStatus === OrderStatus.Confirming) {
      mapRef.current?.animateCamera(
        {
          pitch: 0,
          heading: 0,
          center: { latitude: startOfferPoint.latitude, longitude: startOfferPoint.longitude },
          zoom: 10, // approximately 35km diameter
        },
        { duration: 1500 },
      );
      setMarker({
        colorMode: 'mode1',
        coordinates: { latitude: startOfferPoint.latitude, longitude: startOfferPoint.longitude },
        zIndex: -1,
      });
    } else {
      setMarker(null);
    }
  }, [orderStatus, offerPoints]);

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
          const type: MapPolyline['type'] = 'straight';
          if (prev && prev.type === type && cars.length > 0) {
            return {
              type,
              options: {
                coordinates: calculateNewMapRoute(
                  prev.options.coordinates,
                  cars[0].coordinates,
                  polylineClearPointDistanceMtr,
                ),
              },
            };
          }
          const coordinates = decodeGooglePolyline(pickUpRoute.geometry); // TODO: check, maybe need to reverse array
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
            return {
              type,
              options: {
                coordinates: calculateNewMapRoute(
                  prev.options.coordinates,
                  cars[0].coordinates,
                  polylineClearPointDistanceMtr,
                ),
              },
            };
          }
          const coordinates = decodeGooglePolyline(dropOffRoute.geometry);
          setFinalStopPointCoordinates(coordinates[coordinates.length - 1]);
          setFinalStopPointTimeInSec(dropOffRoute.totalDurationSec);
          return { type, options: { coordinates } };
        });
        break;
      case TripStatus.Idle:
      case TripStatus.Arrived:
        resetPoints();
        break;
      default:
    }
  }, [tripStatus, pickUpRoute, dropOffRoute, cars, resetPoints]);

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
      geolocationCoordinates={geolocationCoordinates ?? undefined}
      geolocationCalculatedHeading={geolocationCalculatedHeading}
      // TODO: * 0.7 - temporary solution, need to make smart waiting of finishing previous animation and then start next
      // (maybe drop few animations if queue is too big)
      // or alternatively do the next request when animation is done (or few miliseconds before ending)
      cars={{ data: cars, animationDuration: updatePassengerGeoInterval * 0.7 }}
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
      markers={marker ? [marker] : undefined}
      cameraMode={cameraMode}
      setCameraModeOnDrag={mode => dispatch(setMapCameraMode(mode))}
      onDragComplete={setMapCameraCoordinates}
    />
  );
};

export default MapView;
