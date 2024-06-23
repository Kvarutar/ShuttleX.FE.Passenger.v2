import { StyleSheet } from 'react-native';
import { AddCardScreen, Card, KeyboardAvoidingView, SafeAreaView } from 'shuttlex-integration';

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
    };
    dispatch(addAvaliablePaymentMethod(newCard));
    dispatch(setSelectedPaymentMethod(newCard));
    navigation.goBack();
  };
  return (
    <KeyboardAvoidingView>
      <SafeAreaView containerStyle={styles.container}>
        <AddCardScreen onCardSave={onCardSave} onBackButtonPress={navigation.goBack} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
});

export default AddPaymentScreen;
