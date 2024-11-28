import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { MapView as MapViewIntegration } from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { updatePassengerGeo } from '../../../core/redux/signalr';
import {
  geolocationCalculatedHeadingSelector,
  geolocationCoordinatesSelector,
} from '../../../core/ride/redux/geolocation/selectors';
import { setMapCameraMode } from '../../../core/ride/redux/map';
import {
  mapCameraModeSelector,
  mapCarsSelector,
  mapPolylinesSelector,
  mapStopPointsSelector,
} from '../../../core/ride/redux/map/selectors';
import { orderIdSelector } from '../../../core/ride/redux/trip/selectors';

const updatePassengerGeoInterval = 1000;

const MapView = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const geolocationCalculatedHeading = useSelector(geolocationCalculatedHeadingSelector);
  const polylines = useSelector(mapPolylinesSelector);
  const stopPoints = useSelector(mapStopPointsSelector);
  const cameraMode = useSelector(mapCameraModeSelector);
  const cars = useSelector(mapCarsSelector);
  const orderId = useSelector(orderIdSelector);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const onDragComplete = (coordinates: LatLng) => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(async () => {
      dispatch(
        updatePassengerGeo({
          position: coordinates,
          // TODO: Check 'InOrder' state with common states logic, not with id
          state: orderId ? 'InOrder' : 'InRadius',
          orderId: orderId ?? null,
        }),
      );
    }, updatePassengerGeoInterval);
  };

  return (
    <MapViewIntegration
      style={StyleSheet.absoluteFill}
      geolocationCoordinates={geolocationCoordinates ?? undefined}
      geolocationCalculatedHeading={geolocationCalculatedHeading}
      // TODO: * 0.7 - temporary solution, need to make smart waiting of finishing previous animation and then start next
      // (maybe drop few animations if queue is too big)
      // or alternatively do the next request when animation is done (or few miliseconds before ending)
      cars={{ data: cars, animationDuration: updatePassengerGeoInterval * 0.7 }}
      polylines={polylines}
      stopPoints={stopPoints}
      cameraMode={cameraMode}
      setCameraModeOnDrag={mode => dispatch(setMapCameraMode(mode))}
      onDragComplete={onDragComplete}
    />
  );
};

export default MapView;
