import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  calculateNewMapRoute,
  decodeGooglePolylineArr,
  getTimeWithAbbreviation,
  MapMarker,
  MapPolyline,
  MapView as MapViewIntegration,
  MarkerTypeWithLabel,
  Nullable,
  secToMilSec,
} from 'shuttlex-integration';

import { useMap } from '../../../core/map/mapContext';
import {
  activeBottomWindowYCoordinateSelector,
  selectedStartRideBottomWindowMenuTabIdxSelector,
} from '../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { updatePassengerGeo } from '../../../core/redux/signalr';
import {
  geolocationCalculatedHeadingSelector,
  geolocationCoordinatesSelector,
} from '../../../core/ride/redux/geolocation/selectors';
import { setMapCameraMode, setMapRidePercentFromPolylines, setMapRouteTraffic } from '../../../core/ride/redux/map';
import {
  mapCameraModeSelector,
  mapCarsSelector,
  mapInterestingPlacesSelector,
  mapStopPointsSelector,
} from '../../../core/ride/redux/map/selectors';
import {
  currentSelectedTariffSelector,
  offerPointsSelector,
  offerRouteFirstWaypointSelector,
  offerRouteLastWaypointSelector,
  offerRouteSelector,
} from '../../../core/ride/redux/offer/selectors';
import { orderStatusSelector } from '../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import {
  orderIdSelector,
  tripDropOffRouteSelector,
  tripPickUpRouteSelector,
  tripStatusSelector,
} from '../../../core/ride/redux/trip/selectors';
import { RouteInfoApiResponse, TripStatus } from '../../../core/ride/redux/trip/types';

const updatePassengerGeoInterval = 1000;
const finalStopPointUpdateIntervalInSec = 30;
const polylineClearPointDistanceMtr = 25;

const screenHeight = Dimensions.get('screen').height;

const MapView = ({ onFirstCameraAnimationComplete }: { onFirstCameraAnimationComplete: () => void }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { mapRef, mapPolyline, setMapPolyline } = useMap();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const geolocationCalculatedHeading = useSelector(geolocationCalculatedHeadingSelector);
  const stopPoints = useSelector(mapStopPointsSelector);
  const cameraMode = useSelector(mapCameraModeSelector);
  const cars = useSelector(mapCarsSelector);
  const interestingPlaces = useSelector(mapInterestingPlacesSelector);
  const orderId = useSelector(orderIdSelector);
  const orderStatus = useSelector(orderStatusSelector);
  const offerPoints = useSelector(offerPointsSelector);
  const offerRoute = useSelector(offerRouteSelector);
  const offerRouteFirstWaypoint = useSelector(offerRouteFirstWaypointSelector);
  const offerRouteLastWaypoint = useSelector(offerRouteLastWaypointSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const pickUpRoute = useSelector(tripPickUpRouteSelector);
  const dropOffRoute = useSelector(tripDropOffRouteSelector);
  const currentSelectedTariff = useSelector(currentSelectedTariffSelector);
  const activeBottomWindowYCoordinate = useSelector(activeBottomWindowYCoordinateSelector);
  const selectedStartRideBottomWindowMenuTabIdx = useSelector(selectedStartRideBottomWindowMenuTabIdxSelector);

  const updatePassengerGeoRef = useRef<NodeJS.Timeout | null>(null);
  const geolocationCoordinatesRef = useRef<Nullable<LatLng>>(null);

  useEffect(() => {
    geolocationCoordinatesRef.current = geolocationCoordinates;
  }, [geolocationCoordinates]);

  const [routePolylinePointsCount, setRoutePolylinePointsCount] = useState<number>(0);
  const [finalStopPointCoordinates, setFinalStopPointCoordinates] = useState<LatLng | null>(null);
  const [finalStopPointTimeInSec, setFinalStopPointTimeInSec] = useState<number>(0);
  const [finalStopPointColorMode, setFinalStopPointColorMode] = useState<MarkerTypeWithLabel['colorMode']>('mode1');
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [mapCameraCoordinates, setMapCameraCoordinates] = useState<LatLng | null>(null);

  const memoizedPolyline = useMemo(() => (mapPolyline ? [mapPolyline] : undefined), [mapPolyline]);

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
      const position = offerRouteFirstWaypoint ? offerRouteFirstWaypoint.geo : mapCameraCoordinates;

      setUpdatePassengerGeoInterval(() => {
        dispatch(
          updatePassengerGeo({
            position,
            state: 'InRadius',
            orderId: null,
          }),
        );
      });
    }
  }, [dispatch, tripStatus, orderStatus, mapCameraCoordinates, offerRouteFirstWaypoint]);

  // Section: polylines
  const resetPoints = useCallback(() => {
    setMapPolyline(null);
    setFinalStopPointCoordinates(null);
  }, [setMapPolyline]);

  // Polyline clearing from moving car
  useEffect(() => {
    switch (tripStatus) {
      case TripStatus.Accepted: // Contarctor -> Pickup
        setMapPolyline(prev => {
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
      case TripStatus.Ride: // Pickup -> DropOff
        setMapPolyline(prev => {
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
    }
  }, [setMapPolyline, tripStatus, cars]);

  useEffect(() => {
    if (mapPolyline && mapPolyline.type !== 'arc') {
      dispatch(
        setMapRidePercentFromPolylines(
          `${Math.floor((1 - mapPolyline.options.coordinates.length / routePolylinePointsCount) * 100)}%`,
        ),
      );
    }
  }, [dispatch, mapPolyline, routePolylinePointsCount]);

  // Section: Markers
  useEffect(() => {
    const startOfferPoint = offerPoints[0];
    if (orderStatus === OrderStatus.Confirming && tripStatus === TripStatus.Idle) {
      setMarkers([
        {
          type: 'simple',
          colorMode: 'mode1',
          coordinates: { latitude: startOfferPoint.latitude, longitude: startOfferPoint.longitude },
        },
      ]);
    } else if (
      (orderStatus === OrderStatus.ChoosingTariff || orderStatus === OrderStatus.Payment) &&
      offerRoute &&
      offerRouteFirstWaypoint &&
      offerRouteLastWaypoint
    ) {
      setMapPolyline({
        type: 'dashed',
        options: { coordinates: decodeGooglePolylineArr(offerRoute.legs.map(leg => leg.geometry)), color: '#ABC736' },
      });
      setMarkers([{ type: 'simple', colorMode: 'mode1', coordinates: offerRouteFirstWaypoint.geo }]);
      setFinalStopPointCoordinates(offerRouteLastWaypoint.geo);
      setFinalStopPointColorMode('mode2');
    } else {
      setMarkers([]);
    }
  }, [
    mapRef,
    setMapPolyline,
    orderStatus,
    offerPoints,
    offerRoute,
    offerRouteFirstWaypoint,
    offerRouteLastWaypoint,
    tripStatus,
  ]);

  useEffect(() => {
    switch (tripStatus) {
      // Contarctor -> Pickup
      case TripStatus.Accepted: {
        if (!pickUpRoute) {
          break;
        }
        const coordinates = decodeGooglePolylineArr(pickUpRoute.legs.map(leg => leg.geometry)); // TODO: check, maybe need to reverse array
        setRoutePolylinePointsCount(coordinates.length);
        setMapPolyline({ type: 'dashed', options: { coordinates, color: '#ABC736' } });

        setMarkers([
          {
            type: 'simple',
            colorMode: 'mode1',
            coordinates: pickUpRoute.waypoints[pickUpRoute.waypoints.length - 1].geo,
          },
        ]);

        const joinedAccurateGeometries: RouteInfoApiResponse['legs'][0]['accurateGeometries'] = [];
        pickUpRoute.legs.forEach(leg => joinedAccurateGeometries.push(...leg.accurateGeometries));
        dispatch(setMapRouteTraffic(joinedAccurateGeometries));
        break;
      }
      // Pickup -> DropOff
      case TripStatus.Ride: {
        if (!dropOffRoute) {
          break;
        }
        const coordinates = decodeGooglePolylineArr(dropOffRoute.legs.map(leg => leg.geometry));
        setRoutePolylinePointsCount(coordinates.length);
        setMapPolyline({ type: 'straight', options: { coordinates } });

        setFinalStopPointCoordinates(dropOffRoute.waypoints[dropOffRoute.waypoints.length - 1].geo);
        setFinalStopPointTimeInSec(dropOffRoute.totalDurationSec);
        setFinalStopPointColorMode('mode1');

        const joinedAccurateGeometries: RouteInfoApiResponse['legs'][0]['accurateGeometries'] = [];
        dropOffRoute.legs.forEach(leg => joinedAccurateGeometries.push(...leg.accurateGeometries));
        dispatch(setMapRouteTraffic(joinedAccurateGeometries));
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
  }, [dispatch, setMapPolyline, tripStatus, orderStatus, pickUpRoute, dropOffRoute, resetPoints]);

  //TODO: dumb logic while backend don't have normal way for algorythms
  useEffect(() => {
    if (orderStatus === OrderStatus.ChoosingTariff && offerRoute) {
      if (currentSelectedTariff?.time) {
        setFinalStopPointTimeInSec(offerRoute.totalDurationSec + currentSelectedTariff.time);
      } else {
        setFinalStopPointTimeInSec(offerRoute.totalDurationSec);
      }
    }
  }, [orderStatus, offerRoute, currentSelectedTariff]);

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

  return (
    <MapViewIntegration
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      mapPadding={{ bottom: activeBottomWindowYCoordinate ? screenHeight - activeBottomWindowYCoordinate : 0 }}
      // Hide current geolocation if in Accepted or Ride status
      geolocationCoordinates={
        tripStatus === TripStatus.Accepted || tripStatus === TripStatus.Ride
          ? undefined
          : (geolocationCoordinates ?? undefined)
      }
      geolocationCalculatedHeading={geolocationCalculatedHeading}
      // TODO: * 0.75 - temporary solution, need to make smart waiting of finishing previous animation and then start next
      // (maybe drop few animations if queue is too big)
      // or alternatively do the next request when animation is done (or few miliseconds before ending)
      // TODO: it's bug - animationDuration is dont change anything ;( (a little correction: it changes something only on android)
      cars={
        selectedStartRideBottomWindowMenuTabIdx === 0
          ? { data: cars, animationDuration: updatePassengerGeoInterval * 0.75 }
          : undefined
      }
      interestingPlaces={selectedStartRideBottomWindowMenuTabIdx === 2 ? interestingPlaces : undefined}
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
      disableSetCameraOnGeolocationAvailable={tripStatus !== TripStatus.Idle}
    />
  );
};

export default MapView;
