import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, FadeOut, runOnJS, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {
  Bar,
  BarModes,
  Button,
  ButtonShapes,
  ChatIcon2,
  LocationIcon,
  NoteIcon,
  PauseRoundIcon,
  PhoneIcon,
  PlayRoundIcon,
  sizes,
  StarIcon,
  Text,
  TriangleIcon,
  useTheme,
  WINDOW_HEIGHT,
} from 'shuttlex-integration';

import { mapMarkerImage } from '../../../assets/images/videosScreen';
import { useAppDispatch } from '../../core/redux/hooks.ts';
import { convertGeoToAddress } from '../../core/ride/redux/geolocation/thunks.ts';
import { setMapCameraMode } from '../../core/ride/redux/map';
import { updateOfferPoint } from '../../core/ride/redux/offer';
import { setOrderStatus } from '../../core/ride/redux/order';
import { OrderStatus } from '../../core/ride/redux/order/types.ts';
import { endTrip } from '../../core/ride/redux/trip';
import { RootStackParamList } from '../../Navigate/props.ts';
import passengerColors from '../../shared/colors/colors.ts';
import BitmovinPlayer from './BitmovinPlayer.tsx';
import { VideoCardProps } from './types';

//TODO: change mockData
const coordinates = {
  latitude: 25.204579554417524,
  longitude: 55.26546275654638,
};

const VideoCard = memo(({ videoData, isActive }: VideoCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const { colors } = useTheme();
  const { t } = useTranslation();

  const [showDescription, setShowDescription] = useState(false);
  const [descriptionNumberOfLines, setDescriptionNumberOfLines] = useState<number | undefined>(1);
  const [paused, setPaused] = useState(false);
  const [isCreateRideLoading, setIsCreateRideLoading] = useState(false);

  const { vodManifestUrl, name, description } = videoData;

  const computedStyles = StyleSheet.create({
    overlay: {
      backgroundColor: passengerColors.videosColors.overlay,
      height: WINDOW_HEIGHT,
    },
    triangleIcon: {
      color: colors.iconTertiaryColor,
    },
    logo: {
      backgroundColor: passengerColors.videosColors.logoBg,
    },
    logoText: {
      color: colors.textTertiaryColor,
    },
    title: {
      color: colors.textTertiaryColor,
    },
    starIcon: {
      color: colors.primaryColor,
    },
    rating: {
      color: passengerColors.videosColors.secondaryText,
    },
    description: {
      color: passengerColors.videosColors.secondaryText,
    },
    textInBar: {
      color: passengerColors.videosColors.secondaryText,
    },
    phoneIcon: {
      color: colors.iconSecondaryColor,
    },
    buttonBorderContainer: {
      backgroundColor: passengerColors.videosColors.bottomButtonWithOpacity,
    },
    goButtonText: {
      color: colors.textPrimaryColor,
    },
    reservationButton: {
      //TODO: return, when we will need this button
      // backgroundColor: passengerColors.videosColors.bottomButtonWithOpacity,
      backgroundColor: colors.borderDashColor,
    },
    reservationButtonText: {
      color: colors.textTertiaryColor,
    },
    messagesButtonSubContainerStyle: {
      //TODO: return, when we will need this button
      // backgroundColor: passengerColors.videosColors.bottomButtonWithOpacity,
      backgroundColor: colors.borderDashColor,
    },
    unreadNotificationsMarker: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    unreadNotificationsMarkerText: {
      color: colors.textPrimaryColor,
    },
  });

  const animatedControlsStyles = useAnimatedStyle(() => ({
    opacity: withTiming(paused ? 1 : 0, {
      duration: 300,
    }),
  }));

  const animatedDescriptionStyles = useAnimatedStyle(() => ({
    maxHeight: withTiming(
      showDescription ? 150 : 42,
      {
        duration: 300,
      },
      finished => {
        if (finished && !showDescription) {
          runOnJS(setDescriptionNumberOfLines)(1);
        }
      },
    ),
  }));

  useEffect(() => {
    if (showDescription) {
      setDescriptionNumberOfLines(undefined);
    }
  }, [showDescription]);

  useEffect(() => {
    if (!isActive) {
      setPaused(false);
    }
  }, [isActive]);

  //TODO: change to correct LatLng
  const navigateToPlace = () => {
    dispatch(setMapCameraMode('free'));
    navigation.navigate('Ride', { mapMarkerCoordinates: coordinates });
  };

  //TODO: change to correct LatLng
  const onCreateRide = async () => {
    setIsCreateRideLoading(true);
    let convertedAddress;

    try {
      convertedAddress = await dispatch(convertGeoToAddress(coordinates)).unwrap();
    } catch {
      convertedAddress = {
        place: `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`,
        fullAddress: '',
        geo: coordinates,
      };
    }

    dispatch(
      updateOfferPoint({
        id: 1,
        address: convertedAddress.place,
        fullAddress: convertedAddress.fullAddress,
        longitude: convertedAddress.geo.longitude,
        latitude: convertedAddress.geo.latitude,
      }),
    );

    // Means order and other ride info cleaning
    dispatch(endTrip());
    dispatch(setOrderStatus(OrderStatus.StartRide));
    navigation.navigate('Ride', { openAddressSelect: true });
    setIsCreateRideLoading(false);
  };

  return (
    <>
      <BitmovinPlayer videoUrl={vodManifestUrl} pause={paused} isActive={isActive} />

      <Animated.View style={[StyleSheet.absoluteFill, animatedControlsStyles]}>
        <Pressable style={[styles.overlay, computedStyles.overlay]} onPress={() => setPaused(!paused)}>
          <TouchableOpacity onPress={() => setPaused(!paused)}>
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              {paused ? <PlayRoundIcon /> : <PauseRoundIcon />}
            </Animated.View>
          </TouchableOpacity>
        </Pressable>
      </Animated.View>

      <LinearGradient
        colors={['transparent', colors.backgroundTertiaryColor]}
        locations={[0, 0.99]}
        style={styles.contentWrapper}
      >
        <View style={styles.logoAndTitleContainer}>
          {/* TODO: Rewrite with the real data (maybe remove this block if we receive an image) */}
          <View style={[styles.logo, computedStyles.logo]}>
            <View style={styles.triangleIcon}>
              <TriangleIcon color={computedStyles.triangleIcon.color} />
            </View>
            <Text style={[styles.logoText, computedStyles.logoText]}>BREA</Text>
            <TriangleIcon color={computedStyles.triangleIcon.color} />
          </View>
          <View style={styles.titleAndRatingContainer}>
            <Text style={[styles.title, computedStyles.title]}>{name}</Text>
            <View style={styles.ratingContainer}>
              <StarIcon color={computedStyles.starIcon.color} style={styles.starIcon} />
              <Text style={[styles.rating, computedStyles.rating]}>4,6</Text>
            </View>
          </View>
        </View>

        <Animated.View style={[styles.descriptionWrapper, animatedDescriptionStyles]}>
          <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={showDescription}>
            <Pressable onPress={() => setShowDescription(!showDescription)}>
              <Text numberOfLines={descriptionNumberOfLines} style={[styles.description, computedStyles.description]}>
                {description}
              </Text>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={styles.placeAndSingerContainer}
                contentContainerStyle={styles.placeAndSingerContentContainer}
              >
                <Bar mode={BarModes.Default} style={styles.bar}>
                  <LocationIcon style={styles.locationIcon} color={passengerColors.videosColors.textInBar} />
                  {/* TODO: Rewrite with the real data */}
                  <Text style={[styles.textInBar, computedStyles.textInBar]}>Dubai Real Estate Search</Text>
                </Bar>
                <Bar mode={BarModes.Default} style={styles.bar}>
                  <NoteIcon />
                  {/* TODO: Rewrite with the real data */}
                  <Text style={[styles.textInBar, computedStyles.textInBar]}>Taylor Swift</Text>
                </Bar>
              </ScrollView>
            </Pressable>
          </ScrollView>
        </Animated.View>

        <View style={styles.bottomContentContainer}>
          {/* TODO: Rewrite with the real block */}
          <Button
            onPress={navigateToPlace}
            shape={ButtonShapes.Circle}
            style={styles.mapButton}
            containerStyle={[styles.buttonBorderContainer, computedStyles.buttonBorderContainer]}
          >
            <ImageBackground source={mapMarkerImage} style={styles.mapBackgroundImage} />
          </Button>
          <Button
            isLoading={isCreateRideLoading}
            loadingSpinnerSize={{ size: 23, strokeWidth: 3 }}
            onPress={onCreateRide}
            style={styles.goButton}
            containerStyle={[styles.buttonBorderContainer, computedStyles.buttonBorderContainer]}
          >
            <Text style={[styles.goButtonText, computedStyles.goButtonText]}>{t('ride_Videos_goButton')}</Text>
          </Button>
          <Button onPress={undefined} style={[styles.reservationButton, computedStyles.reservationButton]}>
            <PhoneIcon color={computedStyles.phoneIcon.color} />
            <Text style={[styles.reservationButtonText, computedStyles.reservationButtonText]}>
              {t('ride_Videos_reservationButton')}
            </Text>
          </Button>
          <Button
            shape={ButtonShapes.Circle}
            withBorder={false}
            style={styles.messagesButtonStyle}
            circleSubContainerStyle={computedStyles.messagesButtonSubContainerStyle}
          >
            <ChatIcon2 />
          </Button>
          {/*TODO: return, when we will need notifications button*/}
          {/*<View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>*/}
          {/*  /!* TODO: Rewrite with the real data *!/*/}
          {/*  <Text style={[styles.unreadNotificationsMarkerText, computedStyles.unreadNotificationsMarkerText]}>*/}
          {/*    12*/}
          {/*  </Text>*/}
          {/*</View>*/}
        </View>
      </LinearGradient>
    </>
  );
});

const styles = StyleSheet.create({
  contentWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: sizes.paddingVertical,
    paddingHorizontal: sizes.paddingHorizontal,
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangleIcon: {
    transform: [{ rotateZ: '180deg' }],
  },
  logoAndTitleContainer: {
    flexDirection: 'row',
    gap: 28,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  logoText: {
    fontFamily: 'Inter Medium',
    fontSize: 8,
    letterSpacing: 4,
  },
  titleAndRatingContainer: {
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Inter Medium',
    fontSize: 22,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starIcon: {
    width: 10,
    height: 10,
  },
  rating: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  descriptionWrapper: {
    marginTop: 4,
  },
  description: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
    marginTop: 14,
  },
  placeAndSingerContainer: {
    marginRight: -sizes.paddingHorizontal,
  },
  placeAndSingerContentContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    paddingRight: sizes.paddingHorizontal,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  textInBar: {
    fontSize: 12,
  },
  locationIcon: {
    height: 14,
    width: 14,
  },
  bottomContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  buttonBorderContainer: {
    borderRadius: 50,
    padding: 2,
  },
  mapButton: {
    height: 46,
    width: 46,
    borderRadius: 1000,
  },
  goButton: {
    height: 46,
    borderRadius: 50,
  },
  goButtonText: {
    fontFamily: 'Inter SemiBold',
    fontSize: 18,
    lineHeight: 32,
  },
  reservationButton: {
    flexDirection: 'row',
    gap: 10,
    height: 50,
    borderRadius: 50,
    //TODO: delete opacity, when we will need this button
    opacity: 0.5,
  },
  reservationButtonText: {
    fontFamily: 'Inter SemiBold',
    fontSize: 14,
    letterSpacing: 0,
  },
  messagesButtonStyle: {
    backgroundColor: undefined,
    height: 50,
    width: 50,
    //TODO: delete opacity, when we will need this button
    opacity: 0.5,
  },
  unreadNotificationsMarker: {
    position: 'absolute',
    top: -4,
    right: -4,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderRadius: 100,
  },
  unreadNotificationsMarkerText: {
    fontFamily: 'Inter Bold',
    fontSize: 8,
    letterSpacing: 0,
  },
  controlIcon: {
    width: 52,
    height: 52,
  },
  mapBackgroundImage: {
    width: 46,
    height: 46,
  },
});

export default VideoCard;
