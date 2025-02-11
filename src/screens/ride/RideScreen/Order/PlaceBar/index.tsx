import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Bar, BarModes, ClockIcon, LocationIcon, mtrToKm, Text, useTheme } from 'shuttlex-integration';

import PlaceTitle from './PlaceTitle';
import { PlaceBarModes, PlaceBarProps } from './types';

const PlaceBar = ({ mode = PlaceBarModes.DefaultAddressSelect, place, onPress, style }: PlaceBarProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    searchDistanceText: {
      color: colors.textTitleColor,
    },
  });

  switch (mode) {
    case PlaceBarModes.Search:
      return (
        <Pressable style={[styles.container, style]} onPress={onPress}>
          <View style={styles.searchContainer}>
            <Bar mode={BarModes.Disabled} style={styles.circleIconContainer}>
              <LocationIcon color={colors.iconPrimaryColor} />
            </Bar>
            <PlaceTitle place={place} style={styles.placeTitle} />
          </View>
          {place.totalDistanceMtr !== undefined && place.totalDistanceMtr !== null && (
            <Text style={[styles.searchDistanceText, computedStyles.searchDistanceText]}>
              {t('ride_Ride_PlaceBar_kilometers', { count: mtrToKm(place.totalDistanceMtr) })}
            </Text>
          )}
        </Pressable>
      );

    case PlaceBarModes.Save:
      return (
        <Bar mode={BarModes.Default} onPress={onPress} style={[styles.barContainer, styles.saveBarContainer, style]}>
          <View style={styles.fullHeaderContainer}>
            <View style={styles.distanceContainer}>
              <Bar mode={BarModes.Disabled} style={styles.circleIconContainer}>
                <ClockIcon color={colors.iconPrimaryColor} />
              </Bar>
              {place.totalDistanceMtr !== undefined && place.totalDistanceMtr !== null && (
                <Bar style={styles.fullDistancePosition}>
                  <Text style={styles.fullDistanceText}>
                    {t('ride_Ride_PlaceBar_kilometers', { count: mtrToKm(place.totalDistanceMtr) })}
                  </Text>
                </Bar>
              )}
            </View>
          </View>
          <PlaceTitle addressesTextNumberOfLines={1} place={place} style={styles.fullTitleContainer} />
        </Bar>
      );

    case PlaceBarModes.DefaultAddressSelect:
      return (
        <Bar mode={BarModes.Default} onPress={onPress} style={[styles.barContainer, styles.container, style]}>
          <PlaceTitle place={place} withDistance />
          <Bar mode={BarModes.Disabled} style={[styles.circleIconContainer, styles.defaultIcon]}>
            <LocationIcon />
          </Bar>
        </Bar>
      );
    case PlaceBarModes.DefaultStart:
      return (
        <Bar mode={BarModes.Default} onPress={onPress} style={[styles.barContainer, styles.container, style]}>
          <LocationIcon />
          <PlaceTitle
            place={place}
            withDistance
            withFullAddress={false}
            addressTextStyle={styles.placeTitleAddressStyle}
          />
        </Bar>
      );
  }
};

const styles = StyleSheet.create({
  barContainer: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  circleIconContainer: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  saveBarContainer: {
    width: 280,
  },
  fullHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceContainer: {
    flex: 1,
  },
  fullDistancePosition: {
    position: 'absolute',
    bottom: -5,
    left: 30,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  fullTitleContainer: {
    marginTop: 12,
  },
  fullDistanceText: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
  defaultIcon: {
    marginLeft: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  searchDistanceText: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
    marginLeft: 5,
  },
  placeTitle: {
    marginLeft: 12,
  },
  placeTitleAddressStyle: {
    fontSize: 14,
  },
});

export default PlaceBar;
