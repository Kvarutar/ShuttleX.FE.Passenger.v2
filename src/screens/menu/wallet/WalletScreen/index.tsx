import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  getPaymentIcon,
  MenuHeader,
  PaymentMethod,
  PlusRoundIcon,
  RoundCheckIcon2,
  SafeAreaView,
  ScrollViewWithCustomScroll,
  SliderWithCustomGesture,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { deleteAvaliablePaymentMethod, setSelectedPaymentMethod } from '../../../../core/menu/redux/wallet';
import {
  avaliablePaymentMethodsSelector,
  selectedPaymentMethodSelector,
} from '../../../../core/menu/redux/wallet/selectors';
import { useAppDispatch } from '../../../../core/redux/hooks';
import Menu from '../../../ride/Menu';
import { WalletScreenProps } from './props';

const isDefaultMethods = ['cash', 'applepay', 'paypal', 'crypto'];

const WalletScreen = ({ navigation }: WalletScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const avaliablePaymentMethods = useSelector(avaliablePaymentMethodsSelector);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const paymentMethods = [
    { method: 'applepay', details: t('menu_Wallet_applepay'), expiresAt: '' },
    { method: 'paypal', details: t('menu_Wallet_paypal'), expiresAt: '' },
    { method: 'crypto', details: t('menu_Wallet_crypto'), expiresAt: '' },
  ];

  const computedStyles = StyleSheet.create({
    addPaymentText: {
      fontSize: 14,
      color: colors.textSecondaryColor,
    },
  });
  let paymentContent = null;

  const paymentMethodsRender = avaliablePaymentMethods.map((el, index) =>
    !isDefaultMethods.includes(el.method) ? (
      //used SliderWithCustomGesture for delete swipe button
      <SliderWithCustomGesture
        key={index}
        rightToLeftSwipe={true}
        childrenStyle={styles.sliderChildren}
        onSwipeEnd={() => {
          dispatch(deleteAvaliablePaymentMethod(el));
          return;
        }}
        containerStyle={[styles.sliderContainer, { backgroundColor: colors.errorColor }]}
        sliderElement={<PaymentItem paymentMethod={el} />}
      >
        <Text style={[styles.testStyle, { color: colors.textTertiaryColor }]}>{t('menu_Wallet_delete')}</Text>
      </SliderWithCustomGesture>
    ) : (
      <PaymentItem key={index} paymentMethod={el} />
    ),
  );
  paymentContent = <View style={styles.paymentMethods}>{paymentMethodsRender}</View>;

  //TODO replace with navigation.navigate('AddPayment') when testing is done
  const onAddCard = () => {
    //TODO send to monobank, etc...
  };
  return (
    <>
      <SafeAreaView containerStyle={styles.container}>
        <ScrollViewWithCustomScroll contentContainerStyle={styles.containerScroll}>
          <View>
            <MenuHeader
              onMenuPress={() => setIsMenuVisible(true)}
              onNotificationPress={() => navigation.navigate('Notifications')}
            >
              <Text style={styles.headerTitle}>{t('menu_Wallet_title')}</Text>
            </MenuHeader>
            <View style={styles.paymentsGap}>
              {paymentContent}
              {paymentMethods.map(el => (
                <PaymentItem paymentMethod={el} />
              ))}
            </View>
          </View>
          <View>
            <Text style={computedStyles.addPaymentText}>{t('menu_Wallet_addPaymentText')}</Text>
            <View style={styles.addCardButtons}>
              <Bar mode={BarModes.Default} style={styles.paymentMethodsItem}>
                <View style={styles.paymentMethodsItemContent}>
                  {getPaymentIcon('card')}
                  <Text style={styles.paymentMethodsTitle}>Card</Text>
                </View>
                <Pressable onPress={onAddCard}>
                  <PlusRoundIcon backgroundColor="#ECEFF2" color="black" />
                </Pressable>
              </Bar>
            </View>
          </View>
        </ScrollViewWithCustomScroll>
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} navigation={navigation} />}
    </>
  );
};

const PaymentItem = ({ paymentMethod }: { paymentMethod: PaymentMethod }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);

  let isActive = false;
  let mode = BarModes.Disabled;

  if (JSON.stringify(selectedPaymentMethod) === JSON.stringify(paymentMethod)) {
    isActive = true;
    mode = BarModes.Active;
  }

  const onPressHandler = () => {
    if (!isActive) {
      dispatch(setSelectedPaymentMethod(paymentMethod));
    }
  };

  const currentDate = new Date();
  const formattedCurrentDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  const isExpired = !isDefaultMethods.includes(paymentMethod.method) && formattedCurrentDate >= paymentMethod.expiresAt;

  return (
    <Bar style={styles.paymentMethodsItem} mode={mode} onPress={onPressHandler}>
      <View style={styles.paymentMethodsItemContent}>
        {getPaymentIcon(paymentMethod.method)}
        <Text style={styles.paymentMethodsTitle}>
          {!isDefaultMethods.includes(paymentMethod.method) ? `**** ${paymentMethod.details}` : paymentMethod.details}
        </Text>
        {isExpired ? (
          <View style={[styles.labelWrapper, { backgroundColor: colors.errorColorWithOpacity }]}>
            <Text style={[styles.expiredLabel, { color: colors.errorColor }]}>{t('menu_Wallet_expired')}</Text>
          </View>
        ) : (
          ''
        )}
      </View>
      {isActive && <RoundCheckIcon2 style={styles.selectedIcon} />}
    </Bar>
  );
};

const styles = StyleSheet.create({
  paymentsGap: {
    gap: 8,
  },
  container: {
    marginVertical: 8,
  },
  containerScroll: {
    gap: 17,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },

  paymentMethods: {
    gap: 8,
    marginTop: 22,
  },
  paymentMethodsTitle: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
  },
  paymentMethodsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 25,
    height: 72,
  },
  paymentMethodsItemContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },

  addCardButtons: {
    marginTop: 12,
    gap: 8,
  },
  selectedIcon: {
    width: 24,
    height: 24,
  },
  expiredLabel: {
    fontSize: 12,
  },
  labelWrapper: {
    borderRadius: 100,
    alignSelf: 'center',
    paddingVertical: 3,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  testStyle: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
  },
  sliderContainer: {
    padding: 0,
  },
  sliderChildren: {
    paddingRight: 14,
    alignItems: 'flex-end',
  },
});

export default WalletScreen;
