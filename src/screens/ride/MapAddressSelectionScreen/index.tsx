import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  ArrowIcon,
  Bar,
  Button,
  ButtonShapes,
  CircleButtonModes,
  CloseIcon,
  MapPinIcon,
  MapView,
  PointIcon,
  SafeAreaView,
  Text,
  TimerV1,
  TimerV1Modes,
  useThemeV1,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { geolocationCoordinatesSelector } from '../../../core/ride/redux/geolocation/selectors';
import { updateOrderPoint } from '../../../core/ride/redux/order';
import { MapAddressSelectionScreenProps } from './props';

const MapAddressSelectionScreen = ({ navigation, route }: MapAddressSelectionScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colors } = useThemeV1();

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
    <SafeAreaView containerStyle={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        geolocationCoordinates={initialCoordinates}
        onDragComplete={onDragComplete}
      />
      <View style={styles.mapPinIconContainer} pointerEvents="none">
        <MapPinIcon style={styles.mapPinIcon} />
      </View>
      <Button
        shape={ButtonShapes.Circle}
        mode={CircleButtonModes.Mode2}
        onPress={navigation.goBack}
        circleSubContainerStyle={styles.goBackButtonContainer}
      >
        <CloseIcon />
      </Button>
      <View style={styles.timerContainer}>
        {isLoading ? (
          <TimerV1
            withCountdown={false}
            startColor={colors.primaryGradientStartColor}
            endColor={colors.primaryColor}
            mode={TimerV1Modes.Mini}
          />
        ) : (
          <Bar style={styles.bottomBar}>
            <PointIcon style={styles.pinIcon} />
            {address ? (
              <Text style={styles.address}>{address}</Text>
            ) : (
              <Text style={[styles.address, { color: colors.textSecondaryColor }]}>
                {t('ride_Ride_MapAddressSelect_placeholder')}
              </Text>
            )}
            <Button style={styles.buttonContainer} shape={ButtonShapes.Circle} onPress={onConfirm} disabled={isLoading}>
              <ArrowIcon />
            </Button>
          </Bar>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
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
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 4,
    borderRadius: 100,
    minHeight: 52,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  pinIcon: {
    width: 25,
    height: 25,
    marginLeft: 6,
  },
  address: {
    textAlign: 'center',
    flexShrink: 1,
  },
  buttonContainer: {
    alignSelf: 'stretch',
    height: 44,
    width: 44,
  },
  goBackButtonContainer: {
    borderWidth: 0,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default MapAddressSelectionScreen;
