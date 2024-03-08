import React, { useEffect, useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  DropOffIcon,
  RoundButton,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
  sizes,
  Text,
  TextInput,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { updateOfferPoint } from '../../../core/ride/redux/offer';
import { AddressItemProps, AddressSelectionScreenProps } from './props';

const addresses = [
  //for test only
  { address: 'a', details: 'textetxtetxtextetxtetxtextetxtetxtextetxtetx' },
  { address: 'ab' },
  { address: 'abc' },
  { address: 'abcd' },
  { address: 'abcde' },
  { address: 'abcdef' },
  { address: 'abcdefg' },
  { address: 'abcdefgh' },
  { address: 'abcdefghiabcdefghiabcdefghiabcdefghi' },
];

const AddressSelectionScreen = ({ navigation, route }: AddressSelectionScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState({
    value: '',
    time: Date.now(),
  });

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - inputValue.time > 300) {
        clearInterval(interval);
      }
    }, 200);
  }, [inputValue]);

  const onChangeText = (text: string) => {
    setInputValue({
      value: text,
      time: Date.now(),
    });
  };

  const onAddressSelect = (address: string) => {
    dispatch(
      updateOfferPoint({
        id: route.params.offerPointId,
        address: address,
      }),
    );
    navigation.goBack();
  };

  const adressesContent = addresses
    .filter(item => item.address.includes(inputValue.value.toLowerCase())) //for test only
    .map((item, index) => (
      <AddressItem
        key={index}
        address={item.address}
        details={item.details}
        onAddressSelect={() => onAddressSelect(item.address)}
      />
    ));

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <View style={[styles.header]}>
        <RoundButton onPress={() => navigation.goBack()}>
          <ShortArrowIcon />
        </RoundButton>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeText}
          value={inputValue.value}
          containerStyle={styles.inputContainer}
        />
      </View>
      <ScrollViewWithCustomScroll
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
        barStyle={styles.bar}
      >
        {adressesContent}
      </ScrollViewWithCustomScroll>
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
  },
  scrollViewContent: {
    gap: 20,
  },
  textWrapper: {
    flexShrink: 1,
  },
});

export default AddressSelectionScreen;
