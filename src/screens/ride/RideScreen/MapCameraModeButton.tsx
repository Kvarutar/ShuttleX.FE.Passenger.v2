import React from 'react';
import { Dimensions, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { MapCameraModeButton as MapCameraModeButtonIntegration, sizes } from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { setMapCameraMode } from '../../../core/ride/redux/map';
import { mapCameraModeSelector } from '../../../core/ride/redux/map/selectors';

const windowHeight = Dimensions.get('window').height;

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

  return <MapCameraModeButtonIntegration mode={cameraMode} onPress={onPress} style={style} />;
};

const style: ViewStyle = {
  position: 'absolute',
  top: windowHeight * 0.45,
  right: sizes.paddingHorizontal,
};

export default MapCameraModeButton;
