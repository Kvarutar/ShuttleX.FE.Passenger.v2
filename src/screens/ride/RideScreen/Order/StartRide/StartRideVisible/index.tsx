import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Bar, BarModes, SearchIcon, sizes, Text, useTheme } from 'shuttlex-integration';

import { offerRecentDropoffsSelector } from '../../../../../../core/ride/redux/offer/selectors';
import { SearchAddressFromAPI } from '../../../../../../core/ride/redux/offer/types';
import PlaceBar from '../../PlaceBar';
import HeaderCarousel from './HeaderCarousel';
import { StartRideVisibleProps } from './types';

const windowWidth = Dimensions.get('window').width;

const animationsDurations = {
  container: 500,
  scrollViewContainer: 300,
};

const StartRideVisible = ({ openAddressSelect, isBottomWindowOpen, setFastAddressSelect }: StartRideVisibleProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const recentDropoffs = useSelector(offerRecentDropoffsSelector);

  const isRecentDropoffsExist = useMemo(() => recentDropoffs.length > 0, [recentDropoffs]);

  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);

  const computedStyles = StyleSheet.create({
    textTitle: {
      color: colors.textPrimaryColor,
    },
    textSubtitle: {
      color: colors.textTitleColor,
    },
    container: {
      marginBottom: isBottomWindowOpen ? 0 : 27,
    },
    scrollView: {
      marginLeft: isSearchBarVisible ? 0 : 70,
    },
    searchContainer: {
      marginLeft: isSearchBarVisible ? 0 : -62,
      marginRight: isSearchBarVisible && isRecentDropoffsExist ? 8 : 0,
      width: isRecentDropoffsExist ? windowWidth * 0.75 : 'auto',
      flex: isRecentDropoffsExist ? 0 : 1,
    },
    scrollViewContainer: {
      marginRight: isRecentDropoffsExist ? -sizes.paddingHorizontal : 'auto',
    },
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setIsSearchBarVisible(offsetX <= windowWidth * 0.75 - 62);
  };

  const openAddressSelectHandler = () => openAddressSelect(true);

  const onFastAddressSelectHandler = (place: SearchAddressFromAPI) => () => {
    setFastAddressSelect(place);
    openAddressSelect(true);
  };

  const searchBar = (
    <Bar
      onPress={openAddressSelectHandler}
      mode={BarModes.Disabled}
      style={[styles.searchContainer, computedStyles.searchContainer]}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.textSubtitle, computedStyles.textSubtitle]}>
          {t('ride_Ride_StartRideVisible_buttonStartTrip')}
        </Text>
        <Text style={[styles.textTitle, computedStyles.textTitle]}>
          {t('ride_Ride_StartRideVisible_buttonWhereToGo')}
        </Text>
      </View>
      <SearchIcon style={styles.searchIcon} />
    </Bar>
  );

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.container, computedStyles.container]}
      layout={FadeIn.duration(animationsDurations.container)}
    >
      {!isBottomWindowOpen && (
        <View style={styles.headerContainer}>
          <HeaderCarousel />
        </View>
      )}
      <Animated.View
        style={[styles.scrollViewContainer, computedStyles.scrollViewContainer]}
        layout={FadeIn.duration(animationsDurations.scrollViewContainer)}
      >
        {!isSearchBarVisible && (
          <Bar onPress={openAddressSelectHandler} mode={BarModes.Disabled} style={styles.extraSearchIconContainer}>
            <SearchIcon />
          </Bar>
        )}
        {isRecentDropoffsExist ? (
          <ScrollView
            style={computedStyles.scrollView}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {searchBar}
            {recentDropoffs.map((place, index) => (
              <PlaceBar
                key={`${place.address}_${index}`}
                style={styles.placeBar}
                place={place}
                onPress={onFastAddressSelectHandler(place)}
              />
            ))}
          </ScrollView>
        ) : (
          searchBar
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  headerContainer: {
    height: 82,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 18,
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
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
