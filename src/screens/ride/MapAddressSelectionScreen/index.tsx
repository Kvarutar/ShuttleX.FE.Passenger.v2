import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  BottomWindow,
  ButtonV1,
  ButtonV1Shapes,
  MapPinIcon,
  MapView,
  SafeAreaView,
  ShortArrowIcon,
  Text,
  Timer,
  TimerModes,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { geolocationCoordinatesSelector } from '../../../core/ride/redux/geolocation/selectors';
import { updateOrderPoint } from '../../../core/ride/redux/order';
import { MapAddressSelectionScreenProps } from './props';

const MapAddressSelectionScreen = ({ navigation, route }: MapAddressSelectionScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const initialCoordinates: LatLng | undefined = geolocationCoordinates ?? undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [addressCoordinates, setAddressCoordinates] = useState<LatLng>({ latitude: 0, longitude: 0 });

  const onDragComplete = async (latlng: LatLng) => {
    console.log('coordinates:', latlng);
    setIsLoading(true);
    // TODO: make request to server
    await new Promise(resolve => setTimeout(resolve, 500));
    setAddress('Test address from backend');
    setAddressCoordinates({ latitude: 123, longitude: 123 });
    setIsLoading(false);
  };

  const onConfirm = () => {
    dispatch(
      updateOrderPoint({
        id: route.params.orderPointId,
        address,
        latitude: addressCoordinates.latitude,
        longitude: addressCoordinates.longitude,
      }),
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <MapView
        style={StyleSheet.absoluteFill}
        geolocationCoordinates={initialCoordinates}
        onDragComplete={onDragComplete}
      />
      <View style={styles.mapPinIconContainer} pointerEvents="none">
        <MapPinIcon style={styles.mapPinIcon} />
      </View>
      <ButtonV1 shape={ButtonV1Shapes.Circle} onPress={navigation.goBack} containerStyle={styles.goBackButtonContainer}>
        <ShortArrowIcon />
      </ButtonV1>
      <BottomWindow windowStyle={styles.bottomWindow}>
        {isLoading ? (
          <Timer
            withCountdown={false}
            startColor={colors.primaryGradientStartColor}
            endColor={colors.primaryColor}
            mode={TimerModes.Mini}
          />
        ) : (
          <>
            <MapPinIcon style={styles.pinIcon} />
            <Text style={styles.address}>{address}</Text>
          </>
        )}
        <ButtonV1
          containerStyle={styles.buttonContainer}
          text={t('ride_MapAddressSelection_confirmButton')}
          onPress={onConfirm}
          disabled={isLoading}
        />
      </BottomWindow>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mapPinIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPinIcon: {
    width: 48,
    height: 48,
    marginBottom: 40, // to center icon
  },
  bottomWindow: {
    alignItems: 'center',
    gap: 16,
  },
  pinIcon: {
    width: 20,
    height: 20,
  },
  address: {
    textAlign: 'center',
  },
  buttonContainer: {
    alignSelf: 'stretch',
  },
  goBackButtonContainer: {
    height: 48,
  },
});

export default MapAddressSelectionScreen;
