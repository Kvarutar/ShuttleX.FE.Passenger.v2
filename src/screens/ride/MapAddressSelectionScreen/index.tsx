import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  ArrowIcon,
  Bar,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  CloseIcon,
  mapConstants,
  MapPinIcon,
  MapView,
  MapViewRef,
  Nullable,
  PointIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import {
  geolocationCalculatedHeadingSelector,
  geolocationCoordinatesSelector,
} from '../../../core/ride/redux/geolocation/selectors';
import { convertGeoToAddress } from '../../../core/ride/redux/geolocation/thunks';
import { updateOfferPoint } from '../../../core/ride/redux/offer';
import { RootStackParamList } from '../../../Navigate/props';
import { EnhancedAddressInfo } from './types';

const MapAddressSelectionScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList, 'MapAddressSelection'>['navigation']>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'MapAddressSelection'>['route']>();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const safeareaInsets = useSafeAreaInsets();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const geolocationCalculatedHeading = useSelector(geolocationCalculatedHeadingSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<Nullable<EnhancedAddressInfo>>(null);
  const [addressCoordinates, setAddressCoordinates] = useState<LatLng>({ latitude: 0, longitude: 0 });

  const mapRef = useRef<MapViewRef>(null);
  const isCameraWasSet = useRef(false);

  useEffect(() => {
    if (!isCameraWasSet.current) {
      const initialCoordinates: Nullable<LatLng> = route.params.pointCoordinates ?? geolocationCoordinates;
      if (initialCoordinates) {
        mapRef.current?.setCamera({
          zoom: mapConstants.cameraZoom - 1,
          pitch: 0,
          heading: 0,
          center: initialCoordinates,
        });
        isCameraWasSet.current = true;
      }
    }
  }, [geolocationCoordinates, route.params.pointCoordinates]);

  const onDragComplete = async (coordinates: LatLng) => {
    // If the new coordinates differ from the previous ones
    if (JSON.stringify(coordinates) !== JSON.stringify(addressCoordinates)) {
      setIsLoading(true);
      let convertedAddress: EnhancedAddressInfo = {
        address: '',
        fullAddress: '',
      };
      try {
        const addressWithFullInfo = await dispatch(convertGeoToAddress(coordinates)).unwrap();
        convertedAddress = {
          address: addressWithFullInfo.place,
          fullAddress: addressWithFullInfo.fullAddress,
        };
      } catch (error) {
        const location = `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
        convertedAddress = {
          address: location,
          fullAddress: '',
        };
      }
      setAddress(convertedAddress);
      setAddressCoordinates(coordinates);
      setIsLoading(false);
    }
  };

  const onConfirm = () => {
    if (address) {
      dispatch(
        updateOfferPoint({
          id: route.params.orderPointId,
          address: address.address,
          fullAddress: address.fullAddress,
          latitude: addressCoordinates.latitude,
          longitude: addressCoordinates.longitude,
        }),
      );
    }
    navigation.goBack();
  };

  const computedStyles = StyleSheet.create({
    closeButton: {
      left: sizes.paddingHorizontal,
      top: safeareaInsets.top || sizes.paddingHorizontal,
    },
    bottomBarContainer: {
      bottom: safeareaInsets.bottom,
      left: sizes.paddingHorizontal,
      right: sizes.paddingHorizontal,
    },
  });

  return (
    <>
      <MapView
        ref={mapRef}
        geolocationCoordinates={geolocationCoordinates ?? undefined}
        geolocationCalculatedHeading={geolocationCalculatedHeading}
        disableSetCameraOnGeolocationAvailable
        style={StyleSheet.absoluteFill}
        onDragComplete={onDragComplete}
      />
      <View style={styles.mapPinIconContainer} pointerEvents="none">
        <MapPinIcon style={styles.mapPinIcon} />
      </View>
      <Button
        containerStyle={[styles.closeButton, computedStyles.closeButton]}
        shape={ButtonShapes.Circle}
        mode={CircleButtonModes.Mode2}
        onPress={navigation.goBack}
        circleSubContainerStyle={styles.goBackButtonContainer}
      >
        <CloseIcon />
      </Button>
      <View style={[styles.bottomBarContainer, computedStyles.bottomBarContainer]}>
        <Bar style={styles.bottomBar}>
          <PointIcon style={styles.pinIcon} />
          {address ? (
            <Text style={styles.address}>{address.fullAddress}</Text>
          ) : (
            <Text style={[styles.address, { color: colors.textSecondaryColor }]}>
              {t('ride_Ride_MapAddressSelect_placeholder')}
            </Text>
          )}
          <Button
            size={ButtonSizes.S}
            isLoading={isLoading}
            style={styles.buttonStyle}
            shape={ButtonShapes.Circle}
            onPress={onConfirm}
            circleSubContainerStyle={styles.circleSubContainerStyle}
          >
            <ArrowIcon />
          </Button>
        </Bar>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPinIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPinIcon: {
    width: 37,
    height: 54,
    marginBottom: 40, // to center icon
  },
  closeButton: {
    position: 'absolute',
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
  buttonStyle: {
    alignSelf: 'stretch',
  },
  circleSubContainerStyle: {
    borderWidth: 0,
  },
  goBackButtonContainer: {
    borderWidth: 0,
  },
  bottomBarContainer: {
    position: 'absolute',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default MapAddressSelectionScreen;
