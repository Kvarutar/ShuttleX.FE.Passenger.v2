import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Bar, BarModes, BookMarkIcon, ClockIcon, LocationIcon, Text, useTheme } from 'shuttlex-integration';

import PlaceTitle from './PlaceTitle';
import { PlaceBarModes, PlaceBarProps } from './props';

const PlaceBar = ({ mode = PlaceBarModes.Default, place, onPress, onSave, style }: PlaceBarProps) => {
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
          {place.distance && (
            <Text style={[styles.searchDistanceText, computedStyles.searchDistanceText]}>
              {t('ride_Ride_PlaceBar_kilometers', { count: Number(place.distance) })}
            </Text>
          )}
        </Pressable>
      );

    case PlaceBarModes.Save:
      return (
        <Bar mode={BarModes.Default} onPress={onPress} style={[styles.barContainer, style]}>
          <View style={styles.fullHeaderContainer}>
            <View>
              <Bar mode={BarModes.Disabled} style={styles.circleIconContainer}>
                <ClockIcon color={colors.iconPrimaryColor} />
              </Bar>
              <Bar style={styles.fullDistancePosition}>
                <Text style={styles.fullDistanceText}>
                  {place.distance && t('ride_Ride_PlaceBar_kilometers', { count: Number(place.distance) })}
                </Text>
              </Bar>
            </View>
            <Pressable onPress={onSave}>
              <BookMarkIcon />
            </Pressable>
          </View>
          <PlaceTitle place={place} style={styles.fullTitleContainer} />
        </Bar>
      );

    case PlaceBarModes.Default:
      return (
        <Bar mode={BarModes.Default} onPress={onPress} style={[styles.barContainer, styles.container, style]}>
          <PlaceTitle place={place} withDistance />
          <Bar mode={BarModes.Disabled} style={[styles.circleIconContainer, styles.defaultIcon]}>
            <LocationIcon />
          </Bar>
        </Bar>
      );
  }
};

const styles = StyleSheet.create({
  barContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  fullHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullDistancePosition: {
    position: 'absolute',
    bottom: -5,
    left: 30,
    width: 64,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullTitleContainer: {
    marginTop: 15,
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
});

export default PlaceBar;
