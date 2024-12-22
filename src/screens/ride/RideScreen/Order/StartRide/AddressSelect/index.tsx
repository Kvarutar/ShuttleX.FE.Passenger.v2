import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import {
  Bar,
  Button,
  CircleButtonModes,
  isCoordinatesEqualZero,
  LoadingSpinner,
  SelectOnMapIcon,
  sizes,
  Text,
  useDebounce,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { updateOfferPoint } from '../../../../../../core/ride/redux/offer';
import { isRoutePointsLocationError } from '../../../../../../core/ride/redux/offer/errors';
import {
  isAvailableTariffsLoadingSelector,
  isCityAvailableSelector,
  isOfferRoutesLoadingSelector,
  isSearchAdressesLoadingSelector,
  offerPointByIdSelector,
  offerPointsSelector,
  offerRecentDropoffsSelector,
  offerRoutesErrorSelector,
} from '../../../../../../core/ride/redux/offer/selectors';
import {
  enhanceAddress,
  getAddressSearchHistory,
  getOfferRoutes,
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
  const isOfferRoutesLoading = useSelector(isOfferRoutesLoadingSelector);

  const isCityAvailable = useSelector(isCityAvailableSelector);
  const offerRoutesError = useSelector(offerRoutesErrorSelector);
  const recentDropoffs = useSelector(offerRecentDropoffsSelector);
  const offerPoints = useSelector(offerPointsSelector);
  const [focusedInput, setFocusedInput] = useState<FocusedInput>({ id: 1, value: '', focus: false });
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [addresses, setAddresses] = useState<SearchAddressFromAPI[]>([]);
  const [addressesHistory, setAddressesHistory] = useState<RecentDropoffsFromAPI[]>([]);
  const [incorrectWaypoints, setIncorrectWaypoints] = useState(false);

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
  });

  useEffect(() => {
    (async () => {
      const addressessHistory = await dispatch(getAddressSearchHistory({ amount: 10 })).unwrap();
      setAddressesHistory(addressessHistory);
    })();
  }, [dispatch]);

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
      dispatch(getOfferRoutes());
    }
  }, [dispatch, isAllOfferPointsFilled]);

  useEffect(() => {
    if (isAllOfferPointsFilled) {
      const isIncorrect = offerRoutesError !== null && isRoutePointsLocationError(offerRoutesError);
      setIncorrectWaypoints(isIncorrect);
      setIsUnsupportedDestinationPopupVisible(isIncorrect);
    }
  }, [isAllOfferPointsFilled, offerRoutesError, setIsUnsupportedDestinationPopupVisible, offerPoints]);

  const onSelectOnMapPress = () => {
    let coordinates: LatLng | undefined;
    if (focusedOfferPoint) {
      const latlng: LatLng = { latitude: focusedOfferPoint.latitude, longitude: focusedOfferPoint.longitude };
      // TODO: remove when offerPoint will be without zero latitude and longitude
      if (!isCoordinatesEqualZero(latlng)) {
        coordinates = latlng;
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
        address: place.dropoffAddress,
        fullAddress: place.fullAddress,
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
        updateFocusedInput={setFocusedInput}
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
          onPress={onSelectOnMapPress}
        />
      </View>
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
          <Button
            isLoading={isAvailableTariffsLoading || isOfferRoutesLoading}
            disabled={incorrectWaypoints || !isCityAvailable}
            onPress={onConfirm}
            mode={isAllOfferPointsFilled ? CircleButtonModes.Mode1 : CircleButtonModes.Mode5}
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
  confirmButtonContainer: {
    paddingVertical: 20,
  },
  searchAddressesText: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
});

export default AddressSelect;
