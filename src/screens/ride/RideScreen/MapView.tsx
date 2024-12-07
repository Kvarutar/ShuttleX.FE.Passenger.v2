import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  calculateNewMapRoute,
  decodeGooglePolyline,
  getTimeWithAbbreviation,
  MapPolyline,
  MapView as MapViewIntegration,
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
  const tripStatus = useSelector(tripStatusSelector);
  const pickUpRoute = useSelector(tripPickUpRouteSelector);
  const dropOffRoute = useSelector(tripDropOffRouteSelector);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [polyline, setPolyline] = useState<Nullable<MapPolyline>>(null);
  const [finalStopPointCoordinates, setFinalStopPointCoordinates] = useState<Nullable<LatLng>>(null);
  const [finalStopPointTimeInSec, setFinalStopPointTimeInSec] = useState<number>(0);

  const onDragComplete = (coordinates: LatLng) => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(async () => {
      dispatch(
        updatePassengerGeo({
          position: coordinates,
          state: 'InLooking',
          orderId: orderId ?? null,
        }),
      );
    }, updatePassengerGeoInterval);
  };

  const resetPoints = useCallback(() => {
    setPolyline(null);
    setFinalStopPointCoordinates(null);
  }, []);

  useEffect(() => {
    switch (tripStatus) {
      case TripStatus.Accepted:
        if (pickUpRoute) {
          const type: MapPolyline['type'] = 'straight';
          setPolyline(prev => {
            if (prev && prev.type === type) {
              return {
                type,
                options: {
                  coordinates: calculateNewMapRoute(
                    prev.options.coordinates,
                    // TODO: change to coordinates of contractor from signalR (InOrder state)
                    { latitude: 0, longitude: 0 },
                    polylineClearPointDistanceMtr,
                  ),
                },
              };
            }
            const coordinates = decodeGooglePolyline(pickUpRoute.geometry); // TODO: check, maybe need to reverse array
            return { type, options: { coordinates } };
          });
        }
        break;
      case TripStatus.Ride:
        if (dropOffRoute) {
          const type: MapPolyline['type'] = 'straight';
          setPolyline(prev => {
            if (prev && prev.type === type && geolocationCoordinates) {
              return {
                type,
                options: {
                  coordinates: calculateNewMapRoute(
                    prev.options.coordinates,
                    geolocationCoordinates,
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
        }
        break;
      case TripStatus.Idle:
      case TripStatus.Arrived:
        resetPoints();
        break;
      default:
    }
  }, [tripStatus, pickUpRoute, dropOffRoute, geolocationCoordinates, resetPoints]);

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
      cameraMode={cameraMode}
      setCameraModeOnDrag={mode => dispatch(setMapCameraMode(mode))}
      onDragComplete={onDragComplete}
    />
  );
};

export default MapView;
