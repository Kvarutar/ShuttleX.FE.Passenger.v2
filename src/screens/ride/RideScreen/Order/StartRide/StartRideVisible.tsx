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
    address: 'Joe`s Pizza',
    details: '7 Carmine St, New York, NY 10014',
    distance: '1.5',
  },
  {
    address: 'Katz`s Delicatessen',
    details: '205 E Houston St, New York, NY 10002',
    distance: '3.2',
  },
  {
    address: 'Shake Shack',
    details: 'Madison Square Park, New York, NY 10010',
    distance: '2.0',
  },
  {
    address: 'Levain Bakery',
    details: '167 W 74th St, New York, NY 10023',
    distance: '4.1',
  },
  {
    address: 'Russ & Daughters',
    details: '179 E Houston St, New York, NY 10002',
    distance: '3.0',
  },
  {
    address: 'Peter Luger Steak House',
    details: '178 Broadway, Brooklyn, NY 11211',
    distance: '5.3',
  },
  {
    address: 'The Spotted Pig',
    details: '314 W 11th St, New York, NY 10014',
    distance: '2.4',
  },
  {
    address: "Lombardi's Pizza",
    details: '32 Spring St, New York, NY 10012',
    distance: '2.8',
  },
  {
    address: 'Carbone',
    details: '181 Thompson St, New York, NY 10012',
    distance: '2.9',
  },
  {
    address: 'Balthazar',
    details: '80 Spring St, New York, NY 10012',
    distance: '3.1',
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
      color: colors.textTitleColor,
    },
    container: {
      marginBottom: isBottomWindowOpen ? 0 : 27,
    },
    headerContainer: {
      display: isBottomWindowOpen ? 'none' : 'flex',
    },
    scrollView: {
      marginLeft: isSearchBarVisible ? 0 : 70,
    },
    searchContainer: {
      marginLeft: isSearchBarVisible ? 0 : -62,
      marginRight: isSearchBarVisible ? 8 : 0,
    },
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setIsSearchBarVisible(offsetX <= windowWidth * 0.75 - 62);
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
        <ScrollView
          style={computedStyles.scrollView}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Bar
            onPress={openAddressSelectHandler}
            mode={BarModes.Disabled}
            style={[styles.searchContainer, computedStyles.searchContainer]}
          >
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
    paddingBottom: 26,
    alignItems: 'flex-end',
    marginTop: 6,
  },
  textContainer: {
    flexDirection: 'column',
    gap: 2,
  },
  carImage: {
    resizeMode: 'contain',
    width: '40%',
    height: undefined,
    aspectRatio: 3,
    flexShrink: 1,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth * 0.75,
  },
  extraSearchIconContainer: {
    width: 62,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  searchIcon: {
    marginRight: 6,
  },
  textTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
    lineHeight: 22,
  },
  textSubtitle: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  placeBar: {
    alignItems: 'center',
    marginRight: 8,
  },
});

export default StartRideVisible;
