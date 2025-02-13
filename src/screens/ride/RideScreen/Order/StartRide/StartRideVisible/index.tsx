import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  Button,
  ButtonShapes,
  CircleButtonModes,
  SearchIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { offerRecentDropoffsSelector } from '../../../../../../core/ride/redux/offer/selectors';
import { RecentDropoffsFromAPI } from '../../../../../../core/ride/redux/offer/types';
import { setIsAddressSelectVisible } from '../../../../../../core/ride/redux/order';
import PlaceBar from '../../PlaceBar';
import { PlaceBarModes } from '../../PlaceBar/types';
import { StartRideVisibleProps } from './types';

const animationsDurations = {
  container: 500,
  scrollViewContainer: 300,
};

const StartRideVisible = ({ isBottomWindowOpen, setFastAddressSelect }: StartRideVisibleProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const recentDropoffs = useSelector(offerRecentDropoffsSelector);

  const isRecentDropoffsExist = useMemo(() => recentDropoffs.length > 0, [recentDropoffs]);

  const computedStyles = StyleSheet.create({
    textTitle: {
      color: colors.textPrimaryColor,
    },
    textSubtitle: {
      color: colors.textTitleColor,
    },
    container: {
      marginBottom: 14,
    },
    searchContainer: {
      width: '100%',
      flex: 0,
    },
    searchAndScrollViewContainer: {
      flexDirection: isBottomWindowOpen ? 'row' : 'column',
      marginTop: isBottomWindowOpen ? 12 : 0,
    },
    scrollView: {
      marginTop: isBottomWindowOpen ? 0 : 8,
      marginLeft: isBottomWindowOpen ? 8 : 0,
    },
    searchIconBWOpened: {
      color: colors.iconPrimaryColor,
    },
  });

  const openAddressSelectHandler = () => dispatch(setIsAddressSelectVisible(true));

  const onFastAddressSelectHandler = (place: RecentDropoffsFromAPI) => () => {
    setFastAddressSelect(place);
    dispatch(setIsAddressSelectVisible(true));
  };

  const searchBar =
    isBottomWindowOpen && isRecentDropoffsExist ? (
      <Button shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2} onPress={openAddressSelectHandler}>
        <SearchIcon style={styles.searchIconBWOpened} />
      </Button>
    ) : (
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
        <SearchIcon style={styles.searchIconBWClosed} />
      </Bar>
    );

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.container, computedStyles.container]}
      layout={FadeIn.duration(animationsDurations.container)}
    >
      {/* Removed in Task-533 */}
      {/* TOOD: Add it when need header carousel */}
      {/* {!isBottomWindowOpen && (
        <View style={styles.headerContainer}>
          <HeaderCarousel />
        </View>
      )} */}
      <Animated.View
        style={[styles.searchAndScrollViewContainer, computedStyles.searchAndScrollViewContainer]}
        layout={FadeIn.duration(animationsDurations.scrollViewContainer)}
      >
        {searchBar}
        {isRecentDropoffsExist && (
          <ScrollView
            style={[styles.scrollView, computedStyles.scrollView]}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {recentDropoffs.map((place, index) => (
              <PlaceBar
                key={`${place.dropoffAddress}_${index}`}
                style={styles.placeBar}
                place={place}
                onPress={onFastAddressSelectHandler(place)}
                mode={PlaceBarModes.DefaultStart}
              />
            ))}
          </ScrollView>
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
  searchAndScrollViewContainer: {
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
  },
  extraSearchIconContainer: {
    width: 62,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  searchIconBWClosed: {
    marginRight: 6,
  },
  searchIconBWOpened: {
    width: 14,
    height: 14,
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
    gap: 8,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});

export default StartRideVisible;
