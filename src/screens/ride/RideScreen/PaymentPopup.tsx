import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  Button,
  ClockIcon,
  DropOffIcon,
  getPaymentIcon,
  LocationIcon,
  Popup,
  RoundButton,
  ShortArrowSmallIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { selectedPaymentMethodSelector } from '../../../core/menu/redux/wallet/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { setOrderStatus } from '../../../core/ride/redux/order';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { RootStackParamList } from '../../../Navigate/props';

const PaymentPopup = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Ride', undefined>;
}) => {
  const { colors } = useTheme();
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    tripTotalSmallItemText: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <Popup onBackButtonPress={() => dispatch(setOrderStatus(OrderStatus.ChoosingTariff))}>
      <Text style={styles.title}>{t('ride_Ride_PaymentPopup_title')}</Text>
      <Pressable style={styles.paymentWrapper} onPress={() => navigation.navigate('Wallet')}>
        <Bar style={styles.payment}>
          {selectedPaymentMethod ? (
            <View style={styles.paymentInfo}>
              {getPaymentIcon(selectedPaymentMethod.method)}
              <Text style={styles.paymentData}>
                {selectedPaymentMethod.method === 'cash'
                  ? t('ride_Ride_PaymentPopup_cash')
                  : `**** ${selectedPaymentMethod.details}`}
              </Text>
            </View>
          ) : (
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentData}>{t('ride_Ride_PaymentPopup_noSelectedMethods')}</Text>
            </View>
          )}
          <RoundButton roundButtonStyle={styles.roundButton}>
            <ShortArrowSmallIcon />
          </RoundButton>
        </Bar>
      </Pressable>
      <Text style={styles.title}>{t('ride_Ride_PaymentPopup_tripInformationTitle')}</Text>
      <View style={styles.tripInfo}>
        <DropOffIcon />
        <Text>2474 John F. Kennedy Blvd</Text>
      </View>
      <View style={styles.tripTotal}>
        <View style={styles.tripTotalSmall}>
          <View style={styles.tripTotalSmallItem}>
            <ClockIcon />
            <Text style={[styles.tripTotalSmallItemText, computedStyles.tripTotalSmallItemText]}>
              {t('ride_Ride_PaymentPopup_minutes', { count: 20 })}
            </Text>
          </View>
          <View style={styles.tripTotalSmallItem}>
            <LocationIcon />
            <Text style={[styles.tripTotalSmallItemText, computedStyles.tripTotalSmallItemText]}>
              {t('ride_Ride_PaymentPopup_kilometers', { count: 5.3 })}
            </Text>
          </View>
        </View>
        <Text style={styles.totalMoney}>$98.80</Text>
      </View>
      {selectedPaymentMethod && (
        <Button
          style={styles.confirmButton}
          text={t('ride_Ride_PaymentPopup_button')}
          onPress={() => dispatch(setOrderStatus(OrderStatus.Confirmation))}
        />
      )}
    </Popup>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
    marginBottom: 20,
  },
  payment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentWrapper: {
    marginBottom: 40,
  },
  paymentInfo: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  paymentData: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 40,
  },
  tripTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripTotalSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tripTotalSmallItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripTotalSmallItemText: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
  },
  totalMoney: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
  },
  roundButton: {
    height: 28,
    width: 28,
  },
  confirmButton: {
    marginTop: 30,
  },
});

export default PaymentPopup;
