import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Bar, BarModes, PassengerDefaultCarImage, SearchIcon, Text, useTheme } from 'shuttlex-integration';

import PlaceBar from '../PlaceBar';
import { PlaceType } from '../PlaceBar/props';
import { RideTextBlockProps, StartRideVisibleProps } from './props';

const testPlaces = [
  {
    address: 'Restaurant',
    details: 'StreetEasy: NYC Real',
    distance: '2',
  },
  {
    address: 'Restaurant',
    details: 'StreetEasy: NYC Real',
    distance: '2',
  },
  {
    address: 'Restaurant',
    details: 'StreetEasy: NYC Real',
    distance: '2',
  },
];

const windowWidth = Dimensions.get('window').width;

const StartRideVisible = ({ openAddressSelect, isBottomWindowOpen, setFastAddressSelect }: StartRideVisibleProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);

  const computedStyles = StyleSheet.create({
    textMainColor: {
      color: colors.textPrimaryColor,
    },
    textExtraColor: {
      color: colors.textSecondaryColor,
    },
    container: {
      marginBottom: isBottomWindowOpen ? 0 : 27,
    },
    headerContainer: {
      display: isBottomWindowOpen ? 'none' : 'flex',
    },
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setIsSearchBarVisible(offsetX <= 295);
  };

  const openAddressSelectHandler = () => openAddressSelect(true);

  const onFastAddressSelectHandler = (place: PlaceType) => () => {
    setFastAddressSelect(place);
    openAddressSelect(true);
  };

  const rideTextBlock = ({
    topText: topText,
    bottomText: bottomText,
    topStyle: topStyle,
    bottomStyle: bottomStyle,
  }: RideTextBlockProps) => (
    <View style={styles.textContainer}>
      <Text style={topStyle}>{topText}</Text>
      <Text style={bottomStyle}>{bottomText}</Text>
    </View>
  );

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={computedStyles.container}>
      <View style={[styles.headerContainer, computedStyles.headerContainer]}>
        {rideTextBlock({
          topText: t('ride_Ride_StartRideVisible_timeGoodTimeToGo'),
          topStyle: [styles.textTitle, computedStyles.textMainColor],
          bottomText: t('ride_Ride_StartRideVisible_timeButtonNow'),
          bottomStyle: [styles.textTitle, computedStyles.textExtraColor],
        })}
        <PassengerDefaultCarImage style={styles.carImage} />
      </View>
      <View style={styles.scrollViewContainer}>
        {!isSearchBarVisible && (
          <Bar onPress={openAddressSelectHandler} mode={BarModes.Disabled} style={styles.extraSearchIconContainer}>
            <SearchIcon />
          </Bar>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
          <Bar onPress={openAddressSelectHandler} mode={BarModes.Disabled} style={styles.searchContainer}>
            {rideTextBlock({
              topText: t('ride_Ride_StartRideVisible_buttonStartTrip'),
              topStyle: [styles.textSubtitle, computedStyles.textExtraColor],
              bottomText: t('ride_Ride_StartRideVisible_buttonWhereToGo'),
              bottomStyle: [styles.textTitle, computedStyles.textMainColor],
            })}
            <SearchIcon style={styles.searchIcon} />
          </Bar>
          {testPlaces.map((place, index) => (
            <PlaceBar
              key={`${place.address}_${index}`}
              style={styles.placeBar}
              place={place}
              onPress={onFastAddressSelectHandler(place)}
            />
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 25,
    alignItems: 'flex-end',
  },
  textContainer: {
    flexDirection: 'column',
  },
  carImage: {
    resizeMode: 'contain',
    flexShrink: 1,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -16,
  },
  searchContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth * 0.75,
    marginRight: 8,
  },
  extraSearchIconContainer: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  textTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
  },
  textSubtitle: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },
  placeBar: {
    alignItems: 'center',
    marginRight: 8,
  },
});

export default StartRideVisible;
