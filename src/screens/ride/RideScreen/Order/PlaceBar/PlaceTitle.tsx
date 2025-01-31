import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { mtrToKm, PickUpIcon, Text, useTheme } from 'shuttlex-integration';

import { PlaceTitleProps } from './types';

const PlaceTitle = ({ withDistance, place, style, addressesTextNumberOfLines = 3 }: PlaceTitleProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    address: {
      color: colors.textPrimaryColor,
    },
    details: {
      color: colors.textTitleColor,
    },
    distance: {
      color: colors.textTitleColor,
    },
  });
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        <Text numberOfLines={addressesTextNumberOfLines} style={[styles.address, computedStyles.address]}>
          {place.dropoffAddress}
        </Text>
        {withDistance && (
          <View style={styles.distanceContainer}>
            <PickUpIcon style={styles.icon} color={colors.iconSecondaryColor} />
            <Text style={[styles.distance, computedStyles.distance]}>
              {place.totalDistanceMtr && t('ride_Ride_PlaceBar_kilometers', { count: mtrToKm(place.totalDistanceMtr) })}
            </Text>
          </View>
        )}
      </View>
      {place.fullAddress && (
        <Text numberOfLines={addressesTextNumberOfLines} style={[styles.details, computedStyles.details]}>
          {place.fullAddress}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexShrink: 1,
  },
  address: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
    flexShrink: 1,
  },
  details: {
    fontSize: 14,
    flexShrink: 1,
    lineHeight: 22,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  distance: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  icon: {
    marginHorizontal: 8,
    width: 10,
    height: 10,
  },
});

export default PlaceTitle;
