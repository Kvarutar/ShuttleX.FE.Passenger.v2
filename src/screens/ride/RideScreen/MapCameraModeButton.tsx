import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { MapCameraModeButton as MapCameraModeButtonIntegration } from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { setMapCameraMode } from '../../../core/ride/redux/map';
import { mapCameraModeSelector } from '../../../core/ride/redux/map/selectors';

const MapCameraModeButton = () => {
  const dispatch = useAppDispatch();

  const cameraMode = useSelector(mapCameraModeSelector);

  const onPress = () => {
    switch (cameraMode) {
      case 'free':
        dispatch(setMapCameraMode('follow'));
        break;
      case 'follow':
        dispatch(setMapCameraMode('followWithCompass'));
        break;
      case 'followWithCompass':
        dispatch(setMapCameraMode('free'));
        break;
    }
  };

  return <MapCameraModeButtonIntegration mode={cameraMode} onPress={onPress} style={styles.button} />;
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
  },
});

export default MapCameraModeButton;
