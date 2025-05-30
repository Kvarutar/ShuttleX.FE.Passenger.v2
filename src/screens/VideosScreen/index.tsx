import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ICarouselInstance } from 'react-native-reanimated-carousel/lib/typescript/types';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShapes,
  ButtonSizes,
  InputXIcon,
  LoadingSpinner,
  SafeAreaView,
  SearchIcon,
  Text,
  TriangleIcon,
  useTheme,
  WINDOW_HEIGHT,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../core/redux/hooks.ts';
import { isVideosLoadingSelector, streamingVideosSelector } from '../../core/ride/redux/streaming/selectors.ts';
import { getVideos } from '../../core/ride/redux/streaming/thunks.ts';
import { RootStackParamList } from '../../Navigate/props';
import passengerColors from '../../shared/colors/colors.ts';
import VideoCard from './VideoCard.tsx';

const VideosScreen = () => {
  const carouselRef = useRef<ICarouselInstance | null>(null);

  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const streamingVideos = useSelector(streamingVideosSelector);
  const isVideosLoading = useSelector(isVideosLoadingSelector);

  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const computedStyles = StyleSheet.create({
    headerCircleSubContainerStyle: {
      backgroundColor: passengerColors.videosColors.headerButton,
    },
    //TODO: this style, when we will need right button
    inactiveHeaderCircleButtonStyle: {
      backgroundColor: colors.borderDashColor,
    },
    headerCentralButton: {
      //TODO: return, when we will need this button
      // backgroundColor: passengerColors.videosColors.headerButton,
      backgroundColor: colors.borderDashColor,
    },
    headerCentralButtonText: {
      color: colors.textTertiaryColor,
    },
    triangleIcon: {
      color: colors.iconTertiaryColor,
    },
    bottomContentBgColor: {
      backgroundColor: passengerColors.videosColors.bottomContentBg,
    },
    noItems: {
      color: colors.textSecondaryColor,
    },
  });

  useEffect(() => {
    if (streamingVideos.length === 0) {
      dispatch(getVideos());
    }
  }, [dispatch, streamingVideos.length]);

  const onProgressChangeCarouselHandler = (_offsetProgress: number, absoluteProgress: number) => {
    const currentIndex = carouselRef.current?.getCurrentIndex() ?? 0;
    if (absoluteProgress > 0.5 || currentIndex === 0) {
      setCurrentVideoIndex(currentIndex);
    }
  };

  const videoList =
    streamingVideos.length === 0 ? (
      <View style={[styles.centralContainer, computedStyles.bottomContentBgColor]}>
        <Text style={computedStyles.noItems}>{t('ride_Videos_noVideos')}</Text>
      </View>
    ) : (
      <Carousel
        ref={carouselRef}
        loop={false}
        vertical
        height={WINDOW_HEIGHT}
        containerStyle={computedStyles.bottomContentBgColor}
        data={streamingVideos}
        onProgressChange={onProgressChangeCarouselHandler}
        windowSize={2}
        scrollAnimationDuration={300}
        renderItem={({ item, index }) => <VideoCard videoData={item} isActive={index === currentVideoIndex} />}
      />
    );

  return (
    <>
      {isVideosLoading && streamingVideos.length === 0 ? (
        <View style={[styles.centralContainer, computedStyles.bottomContentBgColor]}>
          <LoadingSpinner endColor={colors.primaryColor} startColor={passengerColors.videosColors.bottomContentBg} />
        </View>
      ) : (
        videoList
      )}

      <SafeAreaView wrapperStyle={styles.safeAreaView} withTransparentBackground>
        <View style={styles.headerMenuButtonsContainer}>
          <Button
            shape={ButtonShapes.Circle}
            size={ButtonSizes.S}
            style={styles.headerCircleButtonStyle}
            circleSubContainerStyle={[
              styles.headerCircleSubContainerStyle,
              computedStyles.headerCircleSubContainerStyle,
            ]}
            withBorder={false}
            onPress={navigation.goBack}
          >
            <InputXIcon color={colors.iconTertiaryColor} style={styles.headerIconStyle} />
          </Button>
          <Button style={[styles.headerCentralButton, computedStyles.headerCentralButton]}>
            <Text style={[styles.headerCentralButtonText, computedStyles.headerCentralButtonText]}>
              {t('ride_Videos_forYou')}
            </Text>
            <TriangleIcon color={computedStyles.triangleIcon.color} />
          </Button>
          <Button
            shape={ButtonShapes.Circle}
            size={ButtonSizes.S}
            // TODO: this inactiveHeaderCircleButtonStyle, when we will need right button
            style={[styles.headerCircleButtonStyle, styles.inactiveHeaderCircleButtonStyle]}
            circleSubContainerStyle={[
              styles.headerCircleSubContainerStyle,
              computedStyles.headerCircleSubContainerStyle,
              computedStyles.inactiveHeaderCircleButtonStyle,
            ]}
            withBorder={false}
          >
            <SearchIcon color={colors.iconTertiaryColor} style={styles.headerIconStyle} />
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  centralContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaView: {
    position: 'absolute',
  },
  headerMenuButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 46,
  },
  headerCircleButtonStyle: {
    backgroundColor: undefined,
  },
  //TODO: this style, when we will need right button
  inactiveHeaderCircleButtonStyle: {
    opacity: 0.5,
  },
  headerCircleSubContainerStyle: {
    padding: 14,
  },
  headerIconStyle: {
    width: '100%',
    height: '100%',
  },
  headerCentralButton: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 30,
    height: 48,
    //TODO: delete opacity, when we will need this button
    opacity: 0.5,
  },
  headerCentralButtonText: {
    fontFamily: 'Inter Medium',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
});

export default VideosScreen;
