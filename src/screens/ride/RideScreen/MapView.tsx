import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { MapView as MapViewIntegration } from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import {
  geolocationCalculatedHeadingSelector,
  geolocationCoordinatesSelector,
} from '../../../core/ride/redux/geolocation/selectors';
import { setMapCameraMode } from '../../../core/ride/redux/map';
import {
  mapCameraModeSelector,
  mapPolylinesSelector,
  mapStopPointsSelector,
} from '../../../core/ride/redux/map/selectors';

const MapView = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const geolocationCalculatedHeading = useSelector(geolocationCalculatedHeadingSelector);
  const polylines = useSelector(mapPolylinesSelector);
  const stopPoints = useSelector(mapStopPointsSelector);
  const cameraMode = useSelector(mapCameraModeSelector);

  return (
    <MapViewIntegration
      style={StyleSheet.absoluteFill}
      geolocationCoordinates={geolocationCoordinates ?? undefined}
      geolocationCalculatedHeading={geolocationCalculatedHeading}
      polylines={[{ coordinates: polylines }]}
      stopPoints={stopPoints}
      cameraMode={cameraMode}
      setCameraModeOnDrag={mode => dispatch(setMapCameraMode(mode))}
    />
  );
};

export default MapView;
