import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import {
  ArrowIcon,
  Bar,
  Button,
  ButtonShapes,
  ScrollViewWithCustomScroll,
  SelectOnMapIcon,
  Text,
  TimerV1,
  TimerV1Modes,
  useDebounce,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { geolocationCoordinatesSelector } from '../../../../../core/ride/redux/geolocation/selectors';
import { setOrderStatus, updateOrderPoint } from '../../../../../core/ride/redux/order';
import { isOrderLoadingSelector, orderPointsSelector } from '../../../../../core/ride/redux/order/selectors';
import { fetchAddresses } from '../../../../../core/ride/redux/order/thunks';
import { Address, OrderStatus } from '../../../../../core/ride/redux/order/types';
import { RootStackParamList } from '../../../../../Navigate/props';
import PlaceBar from '../PlaceBar';
import { PlaceBarModes } from '../PlaceBar/props';
import AddressButton from './AddressButton';
import PointItem from './PointItem';
import { AddressSelectProps, PointMode } from './props';

const testPlace = [
  {
    address: 'Restaurant',
    details: 'StreetEasy: NYC Real Estate Search',
    distance: '14',
  },
  {
    address: 'Test',
    details: 'StreetEasy: NYC Real Estate Search',
    distance: '14',
  },
  {
    address: 'Place',
    details: 'StreetEasy: NYC Real Estate Search',
    distance: '14',
  },
  {
    address: 'Restaurant',
    details: 'StreetEasy: NYC Real Estate Search',
    distance: '14',
  },
  {
    address: 'Kryptobara',
    details: 'StreetEasy: NYC Real Estate Search',
    distance: '14',
  },
];

const AddressSelect = ({ address, setIsAddressSelectVisible }: AddressSelectProps) => {
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [focusedInput, setFocusedInput] = useState<{ id: number; value: string }>({ id: 1, value: '' });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const debounceInputValue = useDebounce(focusedInput.value, 300);

  const isLoading = useSelector(isOrderLoadingSelector);
  const points = useSelector(orderPointsSelector);
  const defaultLocation = useSelector(geolocationCoordinatesSelector);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Ride'>>();

  useEffect(() => {
    const fetchData = async (text: string) => {
      const fetchedAddresses = await dispatch(fetchAddresses(text)).unwrap();
      setAddresses(fetchedAddresses);
    };

    fetchData(debounceInputValue);
  }, [debounceInputValue, dispatch]);

  useEffect(() => {
    const isAllAddressesFilled = !points.some(el => el.address === '');
    setShowConfirmButton(isAllAddressesFilled);
  }, [points]);

  const computedStyles = StyleSheet.create({
    noAddress: {
      color: colors.textTitleColor,
    },
    title: {
      color: colors.textSecondaryColor,
    },
  });

  useEffect(() => {
    if (defaultLocation) {
      dispatch(
        updateOrderPoint({
          id: 0,
          address: t('ride_Ride_AddressSelect_addressInputMyLocation'),
          longitude: defaultLocation.longitude,
          latitude: defaultLocation.latitude,
        }),
      );
    }
  }, [defaultLocation, dispatch, t]);

  useEffect(() => {
    if (address) {
      dispatch(
        updateOrderPoint({
          id: 1,
          address: address.address,
          longitude: 2412011, //TODO: replace with real coordinates
          latitude: 4214120,
        }),
      );
    }
  }, [address, dispatch]);

  const onConfirm = () => {
    setIsAddressSelectVisible(false);
    dispatch(setOrderStatus(OrderStatus.ChoosingTariff));
  };

  const onLocationSelectPress = () => navigation.navigate('MapAddressSelection', { orderPointId: focusedInput.id });

  const onAddressSelect = (selectedAddress: string) => () => {
    dispatch(
      updateOrderPoint({
        id: focusedInput.id,
        address: selectedAddress,
        longitude: 123123123, //TODO: replace with real coordinates
        latitude: 2132131231,
      }),
    );
  };

  const pointsContent = points.map((point, index) => {
    let pointMode: PointMode = 'default';

    const pointsContentComputedStyles = StyleSheet.create({
      wrapper: {
        zIndex: points.length - point.id,
        borderBottomWidth: point.id === 0 && points.length > 2 ? 1 : 0,
        borderBottomColor: colors.textTertiaryColor,
      },
    });

    if (index === 0) {
      pointMode = 'pickUp';
    } else if (index === points.length - 1) {
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

  let content = (
    <View style={styles.searchPlaceBarWrapper}>
      {addresses?.length ? (
        addresses.map((item, index) => (
          <PlaceBar
            key={`last_search_${index}`}
            mode={PlaceBarModes.Search}
            place={{ address: item.address, details: item.details, distance: '12' }}
            onPress={onAddressSelect(item.address)}
          />
        ))
      ) : (
        <Text style={computedStyles.noAddress}>{t('ride_Ride_AddressSelect_noSuitableAddresses')}</Text>
      )}
    </View>
  );

  if (isLoading) {
    content = (
      <View style={styles.spinnerWrapper}>
        <TimerV1
          withCountdown={false}
          startColor={colors.primaryGradientStartColor}
          endColor={colors.primaryColor}
          mode={TimerV1Modes.Mini}
        />
      </View>
    );
  }

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
      <View style={styles.scrollViewSearchContainer}>
        <ScrollViewWithCustomScroll wrapperStyle={styles.scrollViewSearchWrapper}>
          <View>
            {title(t('ride_Ride_AddressSelect_addressTitle_recent'))}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentPlaceBarWrapper}>
              {testPlace.map((item, index) => (
                <PlaceBar
                  key={`recent_${index}`}
                  mode={PlaceBarModes.Save}
                  place={item}
                  onPress={onAddressSelect(item.address)}
                  style={styles.recentPlaceBar}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.addressContainer}>
            {title(t('ride_Ride_AddressSelect_addressTitle_lastSearch'))}
            {content}
          </View>
        </ScrollViewWithCustomScroll>
        {showConfirmButton && (
          <Button onPress={onConfirm} shape={ButtonShapes.Circle} style={styles.confirmButton}>
            <ArrowIcon />
          </Button>
        )}
      </View>
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
    marginRight: -16,
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
    width: 44,
    height: 44,
    borderWidth: 0,
    right: 0,
    bottom: 5,
  },
});

export default AddressSelect;
