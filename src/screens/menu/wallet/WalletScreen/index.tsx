import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  BlueCheck2,
  Button,
  getPaymentIcon,
  PaymentMethod,
  RoundButton,
  ShortArrowIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { setSelectedPaymentMethod } from '../../../../core/redux/passenger';
import {
  avaliablePaymentMethodsSelector,
  selectedPaymentMethodSelector,
} from '../../../../core/redux/passenger/selectors';
import { WalletScreenProps } from './props';

const WalletScreen = ({ navigation }: WalletScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const avaliablePaymentMethods = useSelector(avaliablePaymentMethodsSelector);

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  let paymentContent = null;
  let emptyWallet = null;

  if (avaliablePaymentMethods.length > 0) {
    const paymentMethodsRender = avaliablePaymentMethods.map((el, index) => (
      <PaymentItem key={index} paymentMethod={el} />
    ));
    paymentContent = <View style={styles.paymentMethods}>{paymentMethodsRender}</View>;
  } else {
    emptyWallet = <Text style={styles.emptyWallet}>{t('ride_PaymentMethodSelection_empty')}</Text>;
  }

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <View style={styles.wrapper}>
        <View>
          <View style={styles.header}>
            <RoundButton onPress={navigation.goBack}>
              <ShortArrowIcon />
            </RoundButton>
            <Text style={styles.headerTitle}>{t('ride_PaymentMethodSelection_title')}</Text>
            <View style={styles.headerDummy} />
          </View>
          {paymentContent}
        </View>
        {emptyWallet}
        <Button text={t('ride_PaymentMethodSelection_button')} onPress={() => navigation.navigate('AddPayment')} />
      </View>
    </SafeAreaView>
  );
};

const PaymentItem = ({ paymentMethod }: { paymentMethod: PaymentMethod }) => {
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);
  const dispatch = useAppDispatch();

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
          <Text style={styles.paymentMethodsTitle}>**** {paymentMethod.details}</Text>
        </View>
        {isActive && <BlueCheck2 />}
      </Bar>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
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
