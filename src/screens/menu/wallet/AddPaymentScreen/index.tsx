import React from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { AddCard, Card, sizes, useTheme } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { addAvaliablePaymentMethod, setSelectedPaymentMethod } from '../../../../core/redux/passenger';
import { AddPaymentScreenProps } from './props';

const AddPaymentScreen = ({ navigation }: AddPaymentScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  const onCardSave = (cardData: Card) => {
    const cardSafeNumber = cardData.number.split(' ');
    const newCard = {
      method: cardData.type ?? 'unknown',
      details: cardSafeNumber[cardSafeNumber.length - 1],
    };
    dispatch(addAvaliablePaymentMethod(newCard));
    dispatch(setSelectedPaymentMethod(newCard));
    navigation.goBack();
  };
  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
        <AddCard onCardSave={onCardSave} onBackButtonPress={navigation.goBack} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    justifyContent: 'space-between',
  },
});

export default AddPaymentScreen;
