import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  BlueCheck2,
  Button,
  RoundButton,
  ShortArrowIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { setSelectedPaymentMethod } from '../../../core/redux/passenger';
import { allPaymentMethodsSelector, selectedPaymentMethodSelector } from '../../../core/redux/passenger/selectors';
import { PaymentMethodType } from '../../../core/redux/passenger/types';
import { paymentIcons } from '../RideScreen/PaymentPopup';
import { PaymentMethodSelectionScreenProps } from './props';

const PaymentMethodSelectionScreen = ({ navigation }: PaymentMethodSelectionScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const allPaymentMethods = useSelector(allPaymentMethodsSelector);

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  let paymentContent = <Text style={styles.emptyWallet}>{t('ride_PaymentMethodSelection_empty')}</Text>;

  if (allPaymentMethods) {
    const paymentMethodsRender = allPaymentMethods.map((el, index) => <PaymentItem key={index} method={el} />);
    paymentContent = <View style={styles.paymentMethods}>{paymentMethodsRender}</View>;
  }

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <View style={styles.wrapper}>
        <View>
          <View style={styles.header}>
            <RoundButton onPress={() => navigation.goBack()}>
              <ShortArrowIcon />
            </RoundButton>
            <Text style={styles.headerTitle}>{t('ride_PaymentMethodSelection_title')}</Text>
            <View style={styles.headerDummy} />
          </View>
        </View>
        {paymentContent}
        <Button text={t('ride_PaymentMethodSelection_button')} />
      </View>
    </SafeAreaView>
  );
};

const PaymentItem = ({ method }: { method: PaymentMethodType }) => {
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);
  const dispatch = useAppDispatch();

  let isActive = false;
  let mode = BarModes.Default;

  if (JSON.stringify(selectedPaymentMethod) === JSON.stringify(method)) {
    isActive = true;
    mode = BarModes.Active;
  }

  const onPressHandler = () => {
    if (!isActive) {
      dispatch(setSelectedPaymentMethod(method));
    }
  };

  return (
    <Pressable onPress={onPressHandler}>
      <Bar style={styles.paymentMethodsItem} mode={mode}>
        <View style={styles.paymentMethodsItemContent}>
          {paymentIcons[method.method]}
          <Text style={styles.paymentMethodsTitle}>{method.details}</Text>
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

export default PaymentMethodSelectionScreen;
