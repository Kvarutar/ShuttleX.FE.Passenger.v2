import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  CustomKeyboardAvoidingView,
  DropOffIcon,
  RoundButton,
  SafeAreaView,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
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
import { AddressItemProps, AddressSelectionScreenProps } from './props';

const AddressSelectionScreen = ({ navigation, route }: AddressSelectionScreenProps): JSX.Element => {
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
    <ScrollViewWithCustomScroll contentContainerStyle={styles.scrollViewContent} barStyle={styles.bar}>
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

  return (
    <CustomKeyboardAvoidingView>
      <SafeAreaView>
        <View style={styles.header}>
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
    </CustomKeyboardAvoidingView>
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
  inputContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
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
  scrollViewContent: {
    gap: 20,
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
