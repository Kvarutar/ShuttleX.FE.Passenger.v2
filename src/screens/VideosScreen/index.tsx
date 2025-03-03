import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShapes,
  ButtonSizes,
  InputXIcon,
  SafeAreaView,
  SearchIcon,
  Text,
  TriangleIcon,
  useTheme,
} from 'shuttlex-integration';

import { streamingVideosSelector } from '../../core/ride/redux/streaming/selectors.ts';
import { RootStackParamList } from '../../Navigate/props';
import passengerColors from '../../shared/colors/colors.ts';
import VideoCard from './VideoCard.tsx';

const windowHeight = Dimensions.get('window').height;

const VideosScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const streamingVideos = useSelector(streamingVideosSelector);

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

  return (
    <>
      {streamingVideos.length === 0 ? (
        <View style={[styles.centralContainer, computedStyles.bottomContentBgColor]}>
          <Text style={computedStyles.noItems}>{t('ride_Videos_noVideos')}</Text>
        </View>
      ) : (
        <Carousel
          loop={false}
          vertical
          height={windowHeight}
          containerStyle={computedStyles.bottomContentBgColor}
          data={streamingVideos}
          onSnapToItem={setCurrentVideoIndex}
          windowSize={2}
          scrollAnimationDuration={300}
          renderItem={({ item, index }) => <VideoCard videoUri={item} isActive={index === currentVideoIndex} />}
        />
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
