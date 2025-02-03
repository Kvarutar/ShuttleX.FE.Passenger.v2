import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import { Bar, BarModes, getCurrencySign, TariffType, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';
import { CurrencyType } from 'shuttlex-integration/lib/typescript/src/utils/currency/types';

import { getTicketByOrderId } from '../../../core/lottery/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { tariffsNamesByFeKey } from '../../../core/ride/redux/offer/utils';
import { getRouteInfo } from '../../../core/ride/redux/trip/thunks';
import { RootStackParamList } from '../../../Navigate/props';
import { RecentAddressesProps } from './types';

const formatDateTime = (date: Date): string => {
  const formattedDate = date.toLocaleDateString(getLocales()[0].languageTag, {
    day: '2-digit',
    month: 'short',
  });
  const formattedTime = date.toLocaleTimeString(getLocales()[0].languageTag, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const [month, day] = formattedDate.split(' ');

  return `${day} ${month}, ${formattedTime}`;
};

const RecentAddressesBar = ({ order }: RecentAddressesProps) => {
  const { colors } = useTheme();
  const tariffIconsData = useTariffsIcons();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ActivityReceiptScreen'>>();
  const dispatch = useAppDispatch();

  const tripTariff = order.tariffInfo;

  const isOrderCanceled = order.state === 'CanceledByContractor' || order.state === 'CanceledByPassenger';

  const computedStyles = StyleSheet.create({
    statusText: {
      color: isOrderCanceled ? colors.errorColor : colors.textPrimaryColor,
    },
    statusContainer: {
      backgroundColor: isOrderCanceled ? colors.errorColorWithOpacity : colors.backgroundSecondaryColor,
    },
    addressesText: {
      color: colors.textTitleColor,
    },
  });

  const getTariffImage = (tripTariffName: TariffType) => {
    return tariffIconsData[tripTariffName].icon({ style: styles.image });
  };

  const onBarPress = () => {
    dispatch(getRouteInfo(order.orderId));
    dispatch(getTicketByOrderId({ orderId: order.orderId }));
    navigation.navigate('ActivityReceiptScreen', { orderId: order.orderId });
  };

  return (
    <Bar onPress={onBarPress} style={styles.container} mode={isOrderCanceled ? BarModes.Disabled : BarModes.Default}>
      <View style={styles.imageContainer}>
        {tripTariff && getTariffImage(tariffsNamesByFeKey[tripTariff.feKey])}
        <View style={[styles.statusContainer, computedStyles.statusContainer]}>
          <Text style={[styles.statusText, computedStyles.statusText]}>
            {isOrderCanceled
              ? t('menu_Activity_canceled')
              : `${getCurrencySign(order.currencyCode as CurrencyType)}${order.totalFinalPrice}`}
          </Text>
        </View>
      </View>
      <View style={styles.addressWrapper}>
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{order.dropOffFullAddress}</Text>
          <Text style={[styles.addressDetailsText, computedStyles.addressesText]}>{order.dropOffPlace}</Text>
        </View>
        <Text style={[styles.dateTimeText, computedStyles.addressesText]}>
          {formatDateTime(new Date(order.finishedDate))}
        </Text>
      </View>
    </Bar>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: '25%',
    height: undefined,
    aspectRatio: 3.15,
    flexShrink: 1,
    resizeMode: 'contain',
  },
  addressWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  addressContainer: {
    flexShrink: 1,
  },
  addressDetailsText: {
    fontSize: 14,
    lineHeight: 22,
  },
  dateTimeText: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  addressText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
});

export default RecentAddressesBar;
