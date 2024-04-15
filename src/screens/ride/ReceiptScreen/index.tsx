import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  Button,
  CloseIcon,
  DropOffIcon,
  getPaymentIcon,
  PickUpIcon,
  RoundButton,
  ScrollViewWithCustomScroll,
  Separator,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { selectedPaymentMethodSelector } from '../../../core/menu/redux/wallet/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { endTrip } from '../../../core/ride/redux/trip';
import { tripInfoSelector, tripTipSelector } from '../../../core/ride/redux/trip/selectors';
import { ReceiptScreenProps } from './props';

const ReceiptScreen = ({ navigation }: ReceiptScreenProps) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const tripInfo = useSelector(tripInfoSelector);
  const tip = useSelector(tripTipSelector);
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    addressDescription: {
      color: colors.textSecondaryColor,
    },
    map: {
      backgroundColor: colors.iconSecondaryColor,
    },
  });

  const onEndTrip = () => {
    navigation.navigate('Ride');
    dispatch(endTrip());
  };

  if (!tripInfo) {
    return <></>;
  }

  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
        <ScrollViewWithCustomScroll contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <RoundButton onPress={onEndTrip}>
              <CloseIcon />
            </RoundButton>
          </View>
          <View style={styles.order}>
            <View style={styles.mapWrapper}>
              <View style={[styles.map, computedStyles.map]} />
            </View>
            <Bar style={styles.addresses}>
              <View style={styles.address}>
                <View style={styles.addressIcons}>
                  <PickUpIcon />
                  <Separator mode="vertical" />
                </View>
                <View style={styles.addressText}>
                  <Text style={[styles.addressDescription, computedStyles.addressDescription]}>
                    {t('ride_Receipt_pickUp')}
                  </Text>
                  <Text numberOfLines={1} style={styles.addressContent}>
                    {tripInfo.route.startPoint.address}
                  </Text>
                  <Separator style={styles.separator} />
                </View>
              </View>
              <View style={styles.address}>
                <View>
                  <DropOffIcon />
                </View>
                <View>
                  <Text style={[styles.addressDescription, computedStyles.addressDescription]}>
                    {t('ride_Receipt_dropOff')}
                  </Text>
                  <Text>{tripInfo.route.endPoints[tripInfo.route.endPoints.length - 1].address}</Text>
                </View>
              </View>
            </Bar>
          </View>
          {selectedPaymentMethod && (
            <View>
              <Text style={styles.paymentTitle}>{t('ride_Receipt_paymentTitle')}</Text>
              <View style={styles.payment}>
                <View style={styles.paymentWrapper}>
                  {getPaymentIcon(selectedPaymentMethod.method)}
                  <Text style={styles.paymentMethod}>
                    {selectedPaymentMethod.method === 'cash'
                      ? t('ride_Receipt_cash')
                      : `**** ${selectedPaymentMethod.details}`}
                  </Text>
                </View>
                <Text style={styles.total}>${tripInfo.total}</Text>
              </View>

              {tip && (
                <>
                  <Separator style={styles.paymentSeparator} />
                  <View style={styles.payment}>
                    <View style={styles.paymentWrapper}>
                      <Text style={styles.paymentMethod}>{t('ride_Receipt_tips')}</Text>
                    </View>
                    <Text style={styles.total}>${tip}</Text>
                  </View>
                </>
              )}
            </View>
          )}
        </ScrollViewWithCustomScroll>
        <Button text={t('ride_Receipt_continueButton')} onPress={onEndTrip} />
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
  content: {
    gap: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  address: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  addressIcons: {
    alignItems: 'center',
  },
  addressDescription: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    marginBottom: 2,
    flexShrink: 1,
  },
  addressContent: {
    marginBottom: 14,
    flexShrink: 1,
  },
  addressText: {
    flexShrink: 1,
  },
  separator: {
    marginBottom: 10,
  },
  paymentSeparator: {
    marginVertical: 20,
  },
  addresses: {
    position: 'relative',
  },
  mapWrapper: {
    position: 'relative',
    paddingHorizontal: 5,
    height: 206,
    marginTop: -20,
  },
  map: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 16,
  },
  order: {
    flexDirection: 'column-reverse',
  },
  paymentTitle: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
    marginBottom: 20,
  },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    fontFamily: 'Inter Medium',
  },
  paymentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  total: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
});

export default ReceiptScreen;
