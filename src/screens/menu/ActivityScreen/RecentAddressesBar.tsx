import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import { Bar, BarModes, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';

import { RecentAddressesProps } from './props';

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

const RecentAddressesBar = ({ trip }: RecentAddressesProps) => {
  const { colors } = useTheme();
  const tariffIconsData = useTariffsIcons();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    statusText: {
      color: trip.status === null ? colors.errorColor : colors.textPrimaryColor,
    },
    statusContainer: {
      backgroundColor: trip.status === null ? colors.errorColorWithOpacity : colors.backgroundSecondaryColor,
    },
    addressesText: {
      color: colors.textTitleColor,
    },
  });

  const TariffImage = tariffIconsData[trip.tripType]?.icon;

  return (
    <Bar style={styles.container} mode={trip.status === null ? BarModes.Disabled : BarModes.Default}>
      <View style={styles.imageContainer}>
        <TariffImage style={styles.image} />
        <View style={[styles.statusContainer, computedStyles.statusContainer]}>
          <Text style={[styles.statusText, computedStyles.statusText]}>
            {trip.status === null ? t('menu_Activity_canceled') : `$${trip.status}`}
          </Text>
        </View>
      </View>
      <View style={styles.addressWrapper}>
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{trip.address}</Text>
          <Text style={[styles.addressDetailsText, computedStyles.addressesText]}>{trip.details}</Text>
        </View>
        <Text style={[styles.dateTimeText, computedStyles.addressesText]}>{formatDateTime(trip.date)}</Text>
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
