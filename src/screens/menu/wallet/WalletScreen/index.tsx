import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  BlueCheck2,
  Button,
  getPaymentIcon,
  PaymentMethod,
  RoundButton,
  SafeAreaView,
  ShortArrowIcon,
  Text,
} from 'shuttlex-integration';

import { setSelectedPaymentMethod } from '../../../../core/menu/redux/wallet';
import {
  avaliablePaymentMethodsSelector,
  selectedPaymentMethodSelector,
} from '../../../../core/menu/redux/wallet/selectors';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { WalletScreenProps } from './props';

const WalletScreen = ({ navigation }: WalletScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const avaliablePaymentMethods = useSelector(avaliablePaymentMethodsSelector);

  let paymentContent = null;
  let emptyWallet = null;

  if (avaliablePaymentMethods.length > 0) {
    const paymentMethodsRender = avaliablePaymentMethods.map((el, index) => (
      <PaymentItem key={index} paymentMethod={el} />
    ));
    paymentContent = <View style={styles.paymentMethods}>{paymentMethodsRender}</View>;
  } else {
    emptyWallet = <Text style={styles.emptyWallet}>{t('menu_Wallet_empty')}</Text>;
  }

  return (
    <SafeAreaView containerStyle={styles.container}>
      <View>
        <View style={styles.header}>
          <RoundButton onPress={navigation.goBack}>
            <ShortArrowIcon />
          </RoundButton>
          <Text style={styles.headerTitle}>{t('menu_Wallet_title')}</Text>
          <View style={styles.headerDummy} />
        </View>
        {paymentContent}
      </View>
      {emptyWallet}
      <Button text={t('menu_Wallet_button')} onPress={() => navigation.navigate('AddPayment')} />
    </SafeAreaView>
  );
};

const PaymentItem = ({ paymentMethod }: { paymentMethod: PaymentMethod }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);

  let isActive = false;
  let mode = BarModes.Default;

  if (JSON.stringify(selectedPaymentMethod) === JSON.stringify(paymentMethod)) {
    isActive = true;
    mode = BarModes.Active;
  }

  const onPressHandler = () => {
    if (!isActive) {
      dispatch(setSelectedPaymentMethod(paymentMethod));
    }
  };

  return (
    <Pressable onPress={onPressHandler}>
      <Bar style={styles.paymentMethodsItem} mode={mode}>
        <View style={styles.paymentMethodsItemContent}>
          {getPaymentIcon(paymentMethod.method)}
          <Text style={styles.paymentMethodsTitle}>
            {paymentMethod.method !== 'cash' ? `**** ${paymentMethod.details}` : t('menu_Wallet_cash')}
          </Text>
        </View>
        {isActive && <BlueCheck2 />}
      </Bar>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  emptyWallet: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    textAlign: 'center',
  },
  headerDummy: {
    width: 50,
  },
  paymentMethods: {
    gap: 14,
    marginTop: 26,
  },
  paymentMethodsTitle: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
  },
  paymentMethodsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodsItemContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
});

export default WalletScreen;
