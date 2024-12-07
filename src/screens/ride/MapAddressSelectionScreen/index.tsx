import { useState } from 'react';
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
  MapPinIcon,
  MapView,
  Nullable,
  PointIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { geolocationCoordinatesSelector } from '../../../core/ride/redux/geolocation/selectors';
import { convertGeoToAddress } from '../../../core/ride/redux/geolocation/thunks';
import { updateOfferPoint } from '../../../core/ride/redux/offer';
import { MapAddressSelectionScreenProps } from './types';

type EnhancedAddressInfo = {
  address: string;
  fullAddress: string;
};

const MapAddressSelectionScreen = ({ navigation, route }: MapAddressSelectionScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const geolocationCoordinates = useSelector(geolocationCoordinatesSelector);
  const initialCoordinates: LatLng | undefined = geolocationCoordinates ?? undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<Nullable<EnhancedAddressInfo>>(null);
  const [addressCoordinates, setAddressCoordinates] = useState<LatLng>({ latitude: 0, longitude: 0 });

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
          fullAdress: address.fullAddress,
          latitude: addressCoordinates.latitude,
          longitude: addressCoordinates.longitude,
        }),
      );
    }
    navigation.goBack();
  };

  const safeareaInsets = useSafeAreaInsets();

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
        style={StyleSheet.absoluteFill}
        geolocationCoordinates={initialCoordinates}
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
