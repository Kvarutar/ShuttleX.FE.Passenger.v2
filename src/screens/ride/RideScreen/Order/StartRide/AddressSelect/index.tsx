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
  sizes,
  Text,
  TimerV1,
  TimerV1Modes,
  useDebounce,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { geolocationCoordinatesSelector } from '../../../../../../core/ride/redux/geolocation/selectors';
import { setOrderStatus, updateOrderPoint } from '../../../../../../core/ride/redux/order';
import { isOrderLoadingSelector, orderPointsSelector } from '../../../../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../../../../core/ride/redux/order/types';
import { RootStackParamList } from '../../../../../../Navigate/props';
import PlaceBar from '../../PlaceBar';
import { PlaceBarModes, PlaceType } from '../../PlaceBar/props';
import AddressButton from './AddressButton';
import PointItem from './PointItem';
import { AddressSelectProps, PointMode } from './props';

const testPlace = [
  {
    address: 'Joe`s Pizza',
    details: '7 Carmine St, New York, NY 10014',
    distance: '1.5',
  },
  {
    address: 'Katz`s Delicatessen',
    details: '205 E Houston St, New York, NY 10002',
    distance: '3.2',
  },
  {
    address: 'Shake Shack',
    details: 'Madison Square Park, New York, NY 10010',
    distance: '2.0',
  },
  {
    address: 'Levain Bakery',
    details: '167 W 74th St, New York, NY 10023',
    distance: '4.1',
  },
  {
    address: 'Russ & Daughters',
    details: '179 E Houston St, New York, NY 10002',
    distance: '3.0',
  },
  {
    address: 'Peter Luger Steak House',
    details: '178 Broadway, Brooklyn, NY 11211',
    distance: '5.3',
  },
  {
    address: 'The Spotted Pig',
    details: '314 W 11th St, New York, NY 10014',
    distance: '2.4',
  },
  {
    address: "Lombardi's Pizza",
    details: '32 Spring St, New York, NY 10012',
    distance: '2.8',
  },
  {
    address: 'Carbone',
    details: '181 Thompson St, New York, NY 10012',
    distance: '2.9',
  },
  {
    address: 'Balthazar',
    details: '80 Spring St, New York, NY 10012',
    distance: '3.1',
  },
];

const AddressSelect = ({ address, setIsAddressSelectVisible }: AddressSelectProps) => {
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [focusedInput, setFocusedInput] = useState<{ id: number | null; value: string }>({ id: null, value: '' });
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [addresses, setAddresses] = useState<PlaceType[]>([]);
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
      // const fetchedAddresses = await dispatch(fetchAddresses(text)).unwrap();
      const fetchedAddresses = testPlace.filter(
        item =>
          item.address.toLowerCase().includes(text.toLowerCase()) ||
          item.details.toLowerCase().includes(text.toLowerCase()),
      );
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
    confirmButton: {
      bottom: sizes.paddingVertical + 5,
    },
    scrollViewSearchContentContainer: {
      paddingBottom: sizes.paddingVertical,
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

  useEffect(() => {
    if (focusedInput.id !== null && focusedInput.value.length) {
      setIsAddressSelected(true);
    }

    if (focusedInput.id !== null && !focusedInput.value.length) {
      setIsAddressSelected(false);
    }
  }, [focusedInput.id, focusedInput.value.length]);

  const onConfirm = () => {
    setIsAddressSelectVisible(false);
    dispatch(setOrderStatus(OrderStatus.ChoosingTariff));
  };

  const onLocationSelectPress = () =>
    navigation.navigate('MapAddressSelection', { orderPointId: focusedInput.id !== null ? focusedInput.id : 1 });

  const onAddressSelect = (selectedAddress: string) => () => {
    setIsAddressSelected(false);
    dispatch(
      updateOrderPoint({
        id: focusedInput.id !== null ? focusedInput.id : 1,
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

  let searchAddresses = (
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
    searchAddresses = (
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
        <ScrollViewWithCustomScroll
          wrapperStyle={styles.scrollViewSearchWrapper}
          contentContainerStyle={computedStyles.scrollViewSearchContentContainer}
        >
          {isAddressSelected ? (
            searchAddresses
          ) : (
            <>
              <View>
                {title(t('ride_Ride_AddressSelect_addressTitle_recent'))}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentPlaceBarWrapper}>
                  {testPlace.map((item, index) => (
                    <PlaceBar
                      key={index}
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
                <View style={styles.searchPlaceBarWrapper}>
                  {testPlace.map((item, index) => (
                    <PlaceBar
                      key={index}
                      mode={PlaceBarModes.Search}
                      place={{ address: item.address, details: item.details, distance: '12' }}
                      onPress={onAddressSelect(item.address)}
                    />
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollViewWithCustomScroll>
        {showConfirmButton && !isAddressSelected && (
          <Button
            onPress={onConfirm}
            shape={ButtonShapes.Circle}
            style={[styles.confirmButton, computedStyles.confirmButton]}
          >
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
    right: 0,
  },
});

export default AddressSelect;
