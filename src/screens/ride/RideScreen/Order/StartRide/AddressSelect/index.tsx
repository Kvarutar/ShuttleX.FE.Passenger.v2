import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  Button,
  CircleButtonModes,
  isCoordinatesEqualZero,
  LoadingSpinner,
  PinIcon,
  SelectOnMapIcon,
  sizes,
  SliderWithCustomGesture,
  SwipeButtonModes,
  Text,
  useDebounce,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { geolocationCoordinatesSelector } from '../../../../../../core/ride/redux/geolocation/selectors';
import { convertGeoToAddress } from '../../../../../../core/ride/redux/geolocation/thunks';
import { updateOfferPoint } from '../../../../../../core/ride/redux/offer';
import { isRouteLengthTooShortError, isRoutePointsLocationError } from '../../../../../../core/ride/redux/offer/errors';
import {
  isAvailableTariffsLoadingSelector,
  isCityAvailableSelector,
  isOfferRouteLoadingSelector,
  isSearchAdressesLoadingSelector,
  offerPointByIdSelector,
  offerPointsSelector,
  offerRecentDropoffsSelector,
  offerRouteErrorSelector,
} from '../../../../../../core/ride/redux/offer/selectors';
import {
  deleteRecentAddress,
  enhanceAddress,
  getAddressSearchHistory,
  getOfferRoute,
  saveSearchResult,
  searchAddress,
} from '../../../../../../core/ride/redux/offer/thunks';
import { RecentDropoffsFromAPI, SearchAddressFromAPI } from '../../../../../../core/ride/redux/offer/types';
import { setOrderStatus } from '../../../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../../../core/ride/redux/order/types';
import { RootStackParamList } from '../../../../../../Navigate/props';
import PlaceBar from '../../PlaceBar';
import { PlaceBarModes } from '../../PlaceBar/types';
import AddressButton from './AddressButton';
import PointItem from './PointItem';
import { AddressSelectProps, FocusedInput, PointMode } from './types';

const AddressSelect = ({
  address,
  setIsAddressSelectVisible,
  setIsUnsupportedDestinationPopupVisible,
}: AddressSelectProps) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Ride'>>();

  const isLoading = useSelector(isSearchAdressesLoadingSelector);
  const isAvailableTariffsLoading = useSelector(isAvailableTariffsLoadingSelector);
  const isOfferRouteLoading = useSelector(isOfferRouteLoadingSelector);

  const isCityAvailable = useSelector(isCityAvailableSelector);
  const offerRouteError = useSelector(offerRouteErrorSelector);
  const recentDropoffs = useSelector(offerRecentDropoffsSelector);
  const offerPoints = useSelector(offerPointsSelector);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [addresses, setAddresses] = useState<SearchAddressFromAPI[]>([]);
  const [addressesHistory, setAddressesHistory] = useState<RecentDropoffsFromAPI[]>([]);
  const [incorrectWaypoints, setIncorrectWaypoints] = useState(false);
  const [myLocation, setMyLocation] = useState({ place: '', fullAddress: '' });

  const defaultLocation = useSelector(geolocationCoordinatesSelector);
  const [focusedInput, setFocusedInput] = useState<FocusedInput>({
    id: defaultLocation ? 1 : 0,
    value: '',
    focus: false,
  });

  const debounceInputValue = useDebounce(focusedInput.value, 300);
  const focusedOfferPoint = useSelector(state => offerPointByIdSelector(state, focusedInput.id));

  const isAllOfferPointsFilled = offerPoints.every(point => point.latitude && point.longitude && point.fullAddress);

  const computedStyles = StyleSheet.create({
    noAddress: {
      color: colors.textTitleColor,
    },
    title: {
      color: colors.textSecondaryColor,
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
    sliderContainer: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    textPlace: {
      color: colors.textQuadraticColor,
    },
  });

  const getSearchHistory = useCallback(async () => {
    const addressessHistory = await dispatch(getAddressSearchHistory({ amount: 10 })).unwrap();
    setAddressesHistory(addressessHistory);
  }, [setAddressesHistory, dispatch]);

  const handleDeleteAddress = useCallback(
    async (id: string) => {
      await dispatch(deleteRecentAddress(id));
      setAddressesHistory(prev => prev.filter(item => item.id !== id));
    },
    [dispatch],
  );

  useEffect(() => {
    getSearchHistory();
  }, [dispatch, getSearchHistory]);

  useEffect(() => {
    if (defaultLocation) {
      (async () => {
        try {
          const addressWithFullInfo = await dispatch(
            convertGeoToAddress({
              latitude: defaultLocation.latitude,
              longitude: defaultLocation.longitude,
            }),
          ).unwrap();
          setMyLocation({ place: addressWithFullInfo.place, fullAddress: addressWithFullInfo.fullAddress });
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      })();
    }
  }, [dispatch, defaultLocation]);

  useEffect(() => {
    if (debounceInputValue.trim() === '') {
      setAddresses([]);
    } else {
      (async () => {
        const result = await dispatch(searchAddress({ query: debounceInputValue, language: i18n.language })).unwrap();

        const mappedRes = result.map<SearchAddressFromAPI>(el => ({
          id: el.externalId,
          dropoffAddress: el.mainText,
          fullAddress: el.secondaryText ?? el.mainText,
          dropoffGeo: {
            latitude: 0,
            longitude: 0,
          },
          totalDistanceMtr: el.distanceMtr,
        }));

        setAddresses(mappedRes);
      })();
    }
  }, [debounceInputValue, i18n.language, dispatch]);

  useEffect(() => {
    if (address) {
      dispatch(
        updateOfferPoint({
          id: 1,
          address: address.dropoffAddress,
          fullAddress: address.fullAddress,
          longitude: address.dropoffGeo.longitude,
          latitude: address.dropoffGeo.latitude,
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

  useEffect(() => {
    if (isAllOfferPointsFilled) {
      dispatch(getOfferRoute());
    }
  }, [dispatch, isAllOfferPointsFilled, incorrectWaypoints]);

  const onSelectOnMapPress = () => {
    let coordinates: LatLng | undefined;
    if (focusedOfferPoint) {
      const latlng: LatLng = { latitude: focusedOfferPoint.latitude, longitude: focusedOfferPoint.longitude };
      // TODO: remove when offerPoint will be without zero latitude and longitude
      if (!isCoordinatesEqualZero(latlng)) {
        coordinates = latlng;
      } else {
        coordinates = offerPoints.find(offerPoint => !isCoordinatesEqualZero(offerPoint));
      }
    }
    navigation.navigate('MapAddressSelection', { orderPointId: focusedInput.id, pointCoordinates: coordinates });
  };

  const onAddressSelect = async (place: SearchAddressFromAPI, isHistory: boolean = false) => {
    let geo: LatLng = {
      latitude: place.dropoffGeo.latitude,
      longitude: place.dropoffGeo.longitude,
    };

    if (!isHistory) {
      const enhancedAddress = await dispatch(enhanceAddress(place)).unwrap();

      dispatch(
        saveSearchResult({
          ...enhancedAddress,
          place: place.dropoffAddress,
          fullAddress: place.fullAddress,
        }),
      );

      geo = {
        latitude: enhancedAddress.geo.latitude,
        longitude: enhancedAddress.geo.longitude,
      };
    }

    dispatch(
      updateOfferPoint({
        id: focusedInput.id,
        address: place.dropoffAddress,
        fullAddress: place.fullAddress,
        latitude: geo.latitude,
        longitude: geo.longitude,
      }),
    );

    const newFocusedPoint = offerPoints.find(el => el.id !== focusedInput.id && el.address === '');
    //TODO: delay only bacause of state updateOfferPoint update
    if (newFocusedPoint) {
      setTimeout(() => setFocusedInput({ id: newFocusedPoint.id, value: '', focus: false }), 300);
    }

    Keyboard.dismiss();
    setIsAddressSelected(false);
    getSearchHistory();
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
        isInFocus={focusedInput.id === point.id}
        updateFocusedInput={setFocusedInput}
        onFocus={() => setIncorrectWaypoints(false)}
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
            style={styles.placeBarStyle}
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
    if (isAllOfferPointsFilled) {
      const isIncorrect = offerRouteError !== null && isRoutePointsLocationError(offerRouteError);
      setIncorrectWaypoints(isIncorrect);
      setIsUnsupportedDestinationPopupVisible(isIncorrect);

      if (!isIncorrect) {
        setIsAddressSelectVisible(false);
        dispatch(setOrderStatus(OrderStatus.ChoosingTariff));
      }
    }
  };

  const onMyLocationPress = () => {
    if (defaultLocation) {
      onAddressSelect(
        {
          id: offerPoints[0] ? '0' : '1',
          fullAddress: t('ride_Ride_AddressSelect_addressButtonMyLocation'),
          dropoffGeo: { latitude: defaultLocation.latitude, longitude: defaultLocation.longitude },
          dropoffAddress: t('ride_Ride_AddressSelect_addressButtonMyLocation'),
        },
        true,
      );
    }
  };

  const isButtonDisabled =
    !isAllOfferPointsFilled ||
    incorrectWaypoints ||
    !isCityAvailable ||
    (offerRouteError !== null && isRouteLengthTooShortError(offerRouteError));

  return (
    <>
      <Bar>{pointsContent}</Bar>
      <View style={styles.addressButtonContainer}>
        <AddressButton
          icon={<SelectOnMapIcon />}
          text={t('ride_Ride_AddressSelect_addressButton_selectLocation')}
          onPress={onSelectOnMapPress}
        />
      </View>

      <Pressable style={[styles.myLocationButtonContainer]} onPress={onMyLocationPress}>
        <View style={styles.myLocationButtonWrapper}>
          <Bar mode={BarModes.Disabled} style={styles.circleIconContainer}>
            <PinIcon />
          </Bar>
        </View>
        <View>
          <Text style={styles.buttonTextMyLocation}>{t('ride_Ride_AddressSelect_addressButtonMyLocation')}</Text>
          <Text style={[styles.textPlace, computedStyles.textPlace]}>
            {myLocation.place ? myLocation.place : t('ride_Ride_AddressSelect_addressButtonMyLocation')}
          </Text>
        </View>
      </Pressable>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.scrollViewSearchContainer}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={[styles.scrollViewSearchWrapper, computedStyles.scrollViewSearchWrapper]}
            contentContainerStyle={computedStyles.scrollViewSearchContentContainer}
            onScroll={Keyboard.dismiss}
            scrollEventThrottle={16}
          >
            {isAddressSelected ? (
              <>
                <Text style={[computedStyles.title, styles.searchAddressesText]}>
                  {t('ride_Ride_AddressSelect_chooseAddress')}
                </Text>
                {searchAddresses}
              </>
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
                          onPress={() => onAddressSelect(item, true)}
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
                        <SliderWithCustomGesture
                          key={index}
                          rightToLeftSwipe={true}
                          mode={SwipeButtonModes.Finish}
                          text={t('menu_Wallet_delete')}
                          textStyle={styles.testStyle}
                          wipeBlockStyle={styles.wipeBlockStyle}
                          onSwipeEnd={() => {
                            if (item.id) {
                              handleDeleteAddress(item.id);
                            }
                          }}
                          containerStyle={[styles.sliderContainer, computedStyles.sliderContainer]}
                          sliderElement={
                            <PlaceBar
                              style={styles.placeBarStyle}
                              mode={PlaceBarModes.Search}
                              place={item}
                              onPress={() => {
                                setIncorrectWaypoints(false);
                                onAddressSelect(item, true);
                              }}
                            />
                          }
                        />
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>
          <Button
            isLoading={isAvailableTariffsLoading || isOfferRouteLoading}
            disabled={isButtonDisabled}
            onPress={onConfirm}
            mode={isAllOfferPointsFilled && !isButtonDisabled ? CircleButtonModes.Mode1 : CircleButtonModes.Mode5}
            containerStyle={styles.confirmButtonContainer}
            text={t('ride_Ride_AddressSelect_confirmButton')}
          />
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
    marginTop: 20,
  },
  scrollViewSearchContainer: {
    flex: 1,
  },
  scrollViewSearchWrapper: {
    flex: 1,
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
  confirmButtonContainer: {
    paddingTop: 20,
    paddingBottom: sizes.paddingVertical,
  },
  searchAddressesText: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  testStyle: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    right: 14,
    alignSelf: 'stretch',
    textAlign: 'right',
  },
  sliderContainer: {
    padding: 0,
  },
  wipeBlockStyle: {
    borderRadius: 24,
  },
  placeBarStyle: {
    paddingVertical: 16,
  },
  myLocationButtonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    gap: 12,
  },
  circleIconContainer: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  myLocationButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  buttonTextMyLocation: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
    letterSpacing: 0,
  },
  textPlace: {
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
});

export default AddressSelect;
