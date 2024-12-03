import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  ArrowIcon,
  Bar,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  LoadingSpinner,
  SelectOnMapIcon,
  sizes,
  Text,
  useDebounce,
  useTheme,
} from 'shuttlex-integration';

import { profileZoneSelector } from '../../../../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { geolocationCoordinatesSelector } from '../../../../../../core/ride/redux/geolocation/selectors';
import { updateOfferPoint } from '../../../../../../core/ride/redux/offer';
import {
  isSearchAdressesLoadingSelector,
  offerPointsSelector,
  offerRecentDropoffsSelector,
} from '../../../../../../core/ride/redux/offer/selectors';
import {
  enhanceAddress,
  getAddressSearchHistory,
  getOfferRoutes,
  saveSearchResult,
  searchAddress,
} from '../../../../../../core/ride/redux/offer/thunks';
import { SearchAddressFromAPI } from '../../../../../../core/ride/redux/offer/types';
import { setOrderStatus } from '../../../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../../../core/ride/redux/order/types';
import { RootStackParamList } from '../../../../../../Navigate/props';
import PlaceBar from '../../PlaceBar';
import { PlaceBarModes } from '../../PlaceBar/types';
import AddressButton from './AddressButton';
import PointItem from './PointItem';
import { AddressSelectProps, PointMode } from './types';

//TODO: rewrite logic for adresses. For the reference - look at yandex GO
const AddressSelect = ({ address, setIsAddressSelectVisible }: AddressSelectProps) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Ride'>>();

  const isLoading = useSelector(isSearchAdressesLoadingSelector);
  const defaultLocation = useSelector(geolocationCoordinatesSelector);
  const recentDropoffs = useSelector(offerRecentDropoffsSelector);
  const offerPoints = useSelector(offerPointsSelector);
  const profileZone = useSelector(profileZoneSelector);
  const initialFocusedInput = defaultLocation
    ? { id: 1, value: offerPoints[1].address, focus: false }
    : { id: 0, value: offerPoints[0].address, focus: false };

  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [focusedInput, setFocusedInput] = useState<{ id: number; value: string; focus: boolean }>(initialFocusedInput);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [updateDefaultLocation, setUpdateDefaultLocation] = useState(true);
  const [addresses, setAddresses] = useState<SearchAddressFromAPI[]>([]);
  const [addressesHistory, setAddressesHistory] = useState<SearchAddressFromAPI[]>([]);
  const debounceInputValue = useDebounce(focusedInput.value, 300);

  const computedStyles = StyleSheet.create({
    noAddress: {
      color: colors.textTitleColor,
    },
    title: {
      color: colors.textSecondaryColor,
    },
    confirmButton: {
      bottom: sizes.paddingVertical + 5,
    },
    scrollViewSearchContentContainer: {
      paddingBottom: sizes.paddingVertical,
    },
    scrollViewSearchWrapper: {
      marginRight: -sizes.paddingHorizontal,
    },
    searchPlaceBarWrapper: {
      marginRight: sizes.paddingHorizontal,
    },
  });

  useEffect(() => {
    (async () => {
      const addressessHistory = await dispatch(getAddressSearchHistory({ amount: 10 })).unwrap();

      setAddressesHistory(addressessHistory);
    })();
  }, [dispatch, setAddressesHistory]);

  useEffect(() => {
    if (debounceInputValue.trim() === '') {
      setAddresses([]);
    } else {
      dispatch(searchAddress({ query: debounceInputValue, language: i18n.language }))
        .unwrap()
        .then(res => {
          const mappedRes = res.map<SearchAddressFromAPI>(el => ({
            id: el.externalId,
            address: el.mainText,
            fullAddress: el.secondaryText,
            geo: {
              latitude: 0,
              longitude: 0,
            },
            totalDistanceMtr: el.distanceMtr,
          }));

          setAddresses(mappedRes);
        });
    }
  }, [debounceInputValue, i18n.language, dispatch]);

  useEffect(() => {
    const isAllAddressesFilled = !offerPoints.some(el => el.address === '');
    setShowConfirmButton(isAllAddressesFilled);
  }, [offerPoints]);

  useEffect(() => {
    if (focusedInput.id === 0) {
      setUpdateDefaultLocation(false);
    }
  }, [focusedInput.id]);

  useEffect(() => {
    if (
      defaultLocation &&
      updateDefaultLocation &&
      offerPoints.find(el => el.address === '' && el.id === 0) !== undefined
    ) {
      dispatch(
        updateOfferPoint({
          id: 0,
          address: t('ride_Ride_AddressSelect_addressInputMyLocation'),
          fullAdress: t('ride_Ride_AddressSelect_addressInputMyLocation'),
          longitude: defaultLocation.longitude,
          latitude: defaultLocation.latitude,
        }),
      );
    }
  }, [defaultLocation, dispatch, t, updateDefaultLocation, offerPoints]);

  useEffect(() => {
    if (address) {
      dispatch(
        updateOfferPoint({
          id: 1,
          address: address.address,
          fullAdress: address.fullAddress,
          longitude: address.geo.longitude,
          latitude: address.geo.latitude,
        }),
      );
    }
  }, [address, dispatch]);

  useEffect(() => {
    if (focusedInput.value && focusedInput.focus) {
      setIsAddressSelected(true);
    }

    if (!focusedInput.value) {
      setIsAddressSelected(false);
    }
  }, [focusedInput.focus, focusedInput.value]);

  const onLocationSelectPress = () => navigation.navigate('MapAddressSelection', { orderPointId: focusedInput.id });

  const onAddressSelect = async (place: SearchAddressFromAPI, isHistory: boolean = false) => {
    let geo: LatLng = {
      latitude: place.geo.latitude,
      longitude: place.geo.longitude,
    };

    if (!isHistory) {
      const enhancedAddress = await dispatch(enhanceAddress(place)).unwrap();

      dispatch(saveSearchResult(enhancedAddress));
      setAddressesHistory(prev => [place, ...prev]);

      geo = {
        latitude: enhancedAddress.geo.latitude,
        longitude: enhancedAddress.geo.longitude,
      };
    }

    dispatch(
      updateOfferPoint({
        id: focusedInput.id,
        address: place.address,
        fullAdress: place.fullAddress,
        latitude: geo.latitude,
        longitude: geo.longitude,
      }),
    );

    Keyboard.dismiss();
    setIsAddressSelected(false);
  };

  const pointsContent = offerPoints.map((point, index) => {
    let pointMode: PointMode = 'default';

    const pointsContentComputedStyles = StyleSheet.create({
      wrapper: {
        zIndex: offerPoints.length - point.id,
        borderBottomWidth: point.id === 0 && offerPoints.length > 2 ? 1 : 0,
        borderBottomColor: colors.textTertiaryColor,
      },
    });

    if (index === 0) {
      pointMode = 'pickUp';
    } else if (index === offerPoints.length - 1) {
      pointMode = 'dropOff';
    }

    return (
      <PointItem
        style={pointsContentComputedStyles.wrapper}
        key={point.id}
        pointMode={pointMode}
        currentPointId={point.id}
        setFocusedInput={setFocusedInput}
      />
    );
  });

  const title = (text: string) => <Text style={computedStyles.title}>{text}</Text>;

  let searchAddresses = (
    <View style={[styles.searchPlaceBarWrapper, computedStyles.searchPlaceBarWrapper]}>
      {addresses?.length ? (
        addresses.map((item, index) => (
          <PlaceBar
            key={`last_search_${index}`}
            mode={PlaceBarModes.Search}
            place={item}
            onPress={() => onAddressSelect(item)}
          />
        ))
      ) : (
        <Text style={computedStyles.noAddress}>{t('ride_Ride_AddressSelect_noSuitableAddresses')}</Text>
      )}
    </View>
  );

  if (isLoading) {
    searchAddresses = (
      <View style={styles.spinnerWrapper}>
        <LoadingSpinner />
      </View>
    );
  }

  const onConfirm = async () => {
    dispatch(getOfferRoutes());
    setIsAddressSelectVisible(false);
    dispatch(setOrderStatus(OrderStatus.ChoosingTariff));
  };

  return (
    <>
      <Bar>{pointsContent}</Bar>
      <View style={styles.addressButtonContainer}>
        <AddressButton
          icon={<SelectOnMapIcon />}
          text={t('ride_Ride_AddressSelect_addressButton_selectLocation')}
          onPress={onLocationSelectPress}
        />
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.scrollViewSearchContainer}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={[styles.scrollViewSearchWrapper, computedStyles.scrollViewSearchWrapper]}
            contentContainerStyle={computedStyles.scrollViewSearchContentContainer}
            // onScroll={Keyboard.dismiss} //TODO: do a proper keyboard hide when scroll through address search
            // scrollEventThrottle={16} //this line is required with onScroll event
          >
            {isAddressSelected ? (
              searchAddresses
            ) : (
              <>
                {recentDropoffs.length > 0 && (
                  <View>
                    {title(t('ride_Ride_AddressSelect_addressTitle_recent'))}
                    <ScrollView
                      //keyboardShouldPersistTaps="handled" //TODO: do a proper keyboard hide when scroll through address search
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.recentPlaceBarWrapper}
                    >
                      {recentDropoffs.map((item, index) => (
                        <PlaceBar
                          key={index}
                          mode={PlaceBarModes.Save}
                          place={item}
                          onPress={() => onAddressSelect(item)}
                          style={styles.recentPlaceBar}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
                {addressesHistory.length > 0 && (
                  <View style={styles.addressContainer}>
                    {title(t('ride_Ride_AddressSelect_addressTitle_lastSearch'))}
                    <View style={[styles.searchPlaceBarWrapper, computedStyles.searchPlaceBarWrapper]}>
                      {addressesHistory.map((item, index) => (
                        <PlaceBar
                          key={index}
                          mode={PlaceBarModes.Search}
                          place={item}
                          onPress={() => onAddressSelect(item, true)}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>
          {showConfirmButton && (
            <Button
              size={ButtonSizes.S}
              disabled={!profileZone}
              onPress={onConfirm}
              mode={profileZone ? CircleButtonModes.Mode1 : CircleButtonModes.Mode4}
              shape={ButtonShapes.Circle}
              style={[styles.confirmButton, computedStyles.confirmButton]}
            >
              <ArrowIcon />
            </Button>
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  spinnerWrapper: {
    alignItems: 'center',
    marginTop: 22,
  },
  searchPlaceBarWrapper: {
    gap: 32,
    marginTop: 20,
    alignItems: 'center',
  },
  scrollViewSearchContainer: {
    flex: 1,
  },
  scrollViewSearchWrapper: {
    flex: 1,
    marginTop: 22,
  },
  recentPlaceBarWrapper: {
    marginTop: 12,
  },
  recentPlaceBar: {
    marginRight: 8,
  },
  addressButtonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  addressContainer: {
    marginTop: 22,
  },
  searchAddressContainer: {
    marginTop: 22,
    flexShrink: 1,
    marginBottom: 10,
  },
  confirmButton: {
    position: 'absolute',
    right: 0,
  },
});

export default AddressSelect;
