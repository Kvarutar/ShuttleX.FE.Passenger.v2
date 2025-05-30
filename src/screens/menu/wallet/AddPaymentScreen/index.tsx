import { StyleSheet } from 'react-native';
import { AddCardScreen, Card, CustomKeyboardAvoidingView, SafeAreaView } from 'shuttlex-integration';

import { addAvaliablePaymentMethod, setSelectedPaymentMethod } from '../../../../core/menu/redux/wallet';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { AddPaymentScreenProps } from './props';

const AddPaymentScreen = ({ navigation }: AddPaymentScreenProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const onCardSave = (cardData: Card) => {
    const cardSafeNumber = cardData.number.split(' ');

    const newCard = {
      method: cardData.type ?? 'unknown',
      details: cardSafeNumber[cardSafeNumber.length - 1],
      expiresAt: cardData.expiresAt,
    };
    dispatch(addAvaliablePaymentMethod(newCard));
    dispatch(setSelectedPaymentMethod(newCard));
    navigation.goBack();
  };
  return (
    <CustomKeyboardAvoidingView>
      <SafeAreaView containerStyle={styles.container}>
        <AddCardScreen onCardSave={onCardSave} onBackButtonPress={navigation.goBack} />
      </SafeAreaView>
    </CustomKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
});

export default AddPaymentScreen;
