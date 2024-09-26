import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { PickUpIcon, Text, useTheme } from 'shuttlex-integration';

import { PlaceTitleProps } from './props';

const PlaceTitle = ({ withDistance, place, style }: PlaceTitleProps) => {
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
        <Text style={[styles.address, computedStyles.address]}>{place.address}</Text>
        {withDistance && (
          <View style={styles.distanceContainer}>
            <PickUpIcon style={styles.icon} color={colors.iconSecondaryColor} />
            <Text style={[styles.distance, computedStyles.distance]}>
              {place.distance && t('ride_Ride_PlaceBar_kilometers', { count: Number(place.distance) })}
            </Text>
          </View>
        )}
      </View>
      {place.details && <Text style={[styles.details, computedStyles.details]}>{place.details}</Text>}
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
    flexShrink: 1,
  },
  details: {
    fontSize: 14,
    flexShrink: 1,
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
