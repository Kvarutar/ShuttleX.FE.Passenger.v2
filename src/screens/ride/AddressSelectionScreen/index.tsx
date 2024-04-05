import React, { useEffect, useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  DropOffIcon,
  RoundButton,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
  sizes,
  Text,
  TextInput,
  Timer,
  TimerModes,
  useDebounce,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { updateOrderPoint } from '../../../core/ride/redux/order';
import { isOrderLoadingSelector } from '../../../core/ride/redux/order/selectors';
import { fetchAddresses } from '../../../core/ride/redux/order/thunks';
import { Address } from '../../../core/ride/redux/order/types';
import { useKeyboardAutoSoftInputModeAndroid } from '../../../core/utils/hooks';
import { AddressItemProps, AddressSelectionScreenProps } from './props';

const AddressSelectionScreen = ({ navigation, route }: AddressSelectionScreenProps): JSX.Element => {
  useKeyboardAutoSoftInputModeAndroid();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [inputValue, setInputValue] = useState('');
  const debounceInputValue = useDebounce(inputValue, 300);
  const isLoading = useSelector(isOrderLoadingSelector);

  useEffect(() => {
    const fetchData = async (prompt: string) => {
      //TODO: fix "streetName" to prompt when be will be ready
      console.log(prompt);
      const fetchedAddresses = await dispatch(fetchAddresses('streetName')).unwrap();
      setAddresses(fetchedAddresses);
    };

    fetchData(debounceInputValue);
  }, [debounceInputValue, dispatch]);

  const onChangeText = (text: string) => {
    setInputValue(text);
  };

  const onAddressSelect = (address: string) => {
    dispatch(
      updateOrderPoint({
        id: route.params.orderPointId,
        address: address,
        longitude: 123123123, //TODO: replace with real coordinates
        latitude: 2132131231,
      }),
    );
    navigation.goBack();
  };

  let content = (
    <ScrollViewWithCustomScroll
      contentContainerStyle={styles.scrollViewContent}
      style={styles.scrollView}
      barStyle={styles.bar}
    >
      {addresses.map((item, index) => (
        <AddressItem
          key={index}
          address={item.address}
          details={item.details}
          onAddressSelect={() => onAddressSelect(item.address)}
        />
      ))}
    </ScrollViewWithCustomScroll>
  );

  if (isLoading) {
    content = (
      <View style={styles.spinnerWrapper}>
        <Timer
          withCountdown={false}
          startColor={colors.primaryGradientStartColor}
          endColor={colors.primaryColor}
          mode={TimerModes.Mini}
        />
      </View>
    );
  }

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <View style={[styles.header]}>
        <RoundButton onPress={navigation.goBack}>
          <ShortArrowIcon />
        </RoundButton>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeText}
          value={inputValue}
          containerStyle={styles.inputContainer}
        />
      </View>
      {content}
    </SafeAreaView>
  );
};

const AddressItem = ({ address, onAddressSelect, details }: AddressItemProps) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    details: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <Pressable onPress={onAddressSelect}>
      <View style={styles.addressItemWrapper}>
        <DropOffIcon />
        <View style={styles.textWrapper}>
          <Text numberOfLines={1} style={styles.address}>
            {address}
          </Text>
          <Text numberOfLines={1} style={computedStyles.details}>
            {details}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: sizes.paddingVertical,
  },
  inputContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: sizes.paddingHorizontal,
    marginBottom: 24,
  },
  bar: {
    top: 0,
  },
  textInput: {
    flex: 1,
  },
  addressItemWrapper: {
    flexDirection: 'row',
    gap: 15,
    flexShrink: 1,
  },
  address: {
    marginBottom: 6,
    flexShrink: 1,
  },
  scrollView: {
    paddingHorizontal: sizes.paddingHorizontal,
    marginVertical: 0,
  },
  scrollViewContent: {
    gap: 20,
    paddingVertical: 0,
  },
  textWrapper: {
    flexShrink: 1,
  },
  spinnerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddressSelectionScreen;
