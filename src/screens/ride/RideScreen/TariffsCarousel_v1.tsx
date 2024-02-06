import React, { ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlexStyle, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import {
  BaggageIcon,
  Bar,
  BasicXImage,
  BasicXLImage,
  Button,
  ClockIcon,
  ComfortXImage,
  PassengerIcon2,
  PremiumXImage,
  PremiumXLImage,
  sizes,
  TariffType,
  TeslaXImage,
  Text,
  useTheme,
} from 'shuttlex-integration';

const windowWidth = Dimensions.get('window').width;

const cardSizes = {
  small: {
    width: 151,
    height: 166,
  },
  big: {
    width: 238,
    height: 274,
  },
};

const keyframes = {
  rightAfterPrevious: -0.8,
  rightBeforeCurrent: -0.2,
  rightAfterCurrent: 0.2,
  rightBeforeNext: 0.8,
};

const TariffsCarousel = () => {
  // this version have perfomance issues
  const tariffs: TariffType[] = ['BasicX', 'BasicXL', 'PremiumXL', 'ComfortX', 'PremiumX', 'PremiumXL', 'TeslaX']; //for test only

  const animationStyle = useCallback((value: number) => {
    'worklet';

    const width = interpolate(
      value,
      [-1, 0, 1],
      [cardSizes.small.width, cardSizes.big.width + 20, cardSizes.small.width],
      Extrapolation.CLAMP,
    );
    const height = interpolate(
      value,
      [-1, 0, 1],
      [cardSizes.small.height, cardSizes.big.height, cardSizes.small.height],
      Extrapolation.CLAMP,
    );
    const translateX = interpolate(value, [-1, 0, 1], [-cardSizes.big.width, 0, cardSizes.big.width]);

    return {
      transform: [{ translateX }],
      width,
      height,
    };
  }, []);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.carouselWrapper}>
      <Carousel
        loop={false}
        style={styles.carouselContentWrapper}
        width={cardSizes.big.width}
        height={320}
        data={[...tariffs]}
        customAnimation={animationStyle}
        scrollAnimationDuration={300}
        renderItem={({ item, animationValue }) => <CarouselItem animationValue={animationValue} item={item} />}
      />
    </Animated.View>
  );
};

const CarouselItem = ({ animationValue, item }: { animationValue: SharedValue<number>; item: TariffType }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const tariffsImages: Record<TariffType, ReactNode> = {
    BasicX: <BasicXImage style={styles.barImage} />,
    BasicXL: <BasicXLImage style={styles.barImage} />,
    ComfortX: <ComfortXImage style={styles.barImage} />,
    PremiumX: <PremiumXImage style={styles.barImage} />,
    PremiumXL: <PremiumXLImage style={styles.barImage} />,
    TeslaX: <TeslaXImage style={styles.barImage} />,
  };

  const computedStyles = StyleSheet.create({
    barContentText: {
      color: colors.textSecondaryColor,
    },
  });

  const carouselItemWrapperAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(animationValue.value, [-2, -1, 0, 1, 2], [-30, 40, 20, 40, -30], Extrapolation.CLAMP) },
    ],
  }));

  const opacityAnimatedStyles = useAnimatedStyle(() => ({
    opacity: interpolate(
      animationValue.value,
      [keyframes.rightBeforeCurrent, 0, keyframes.rightAfterCurrent],
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const imageAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(animationValue.value, [-1, 0, 1], [0.7, 1, 0.7], Extrapolation.CLAMP) }],
  }));

  const titleAnimatedStyles = useAnimatedStyle(() => {
    let justifyContent: FlexStyle['justifyContent'] = 'center';
    const opacity = interpolate(
      animationValue.value,
      [
        -1,
        keyframes.rightAfterPrevious,
        keyframes.rightBeforeCurrent,
        0,
        keyframes.rightAfterCurrent,
        keyframes.rightBeforeNext,
        1,
      ],
      [1, 0, 0, 1, 0, 0, 1],
      Extrapolation.CLAMP,
    );
    const marginBottom = interpolate(animationValue.value, [-1, 0, 1], [10, 30, 10], Extrapolation.CLAMP);

    if (animationValue.value >= keyframes.rightBeforeCurrent && animationValue.value <= keyframes.rightAfterCurrent) {
      justifyContent = 'space-between';
    }
    return { justifyContent, opacity, marginBottom };
  });

  const desriptionAnimatedStyles = useAnimatedStyle(() => {
    let flexDirection: FlexStyle['flexDirection'] = 'column-reverse';
    const opacity = interpolate(
      animationValue.value,
      [
        -1,
        keyframes.rightAfterPrevious,
        keyframes.rightBeforeCurrent,
        0,
        keyframes.rightAfterCurrent,
        keyframes.rightBeforeNext,
        1,
      ],
      [1, 0, 0, 1, 0, 0, 1],
      Extrapolation.CLAMP,
    );

    if (animationValue.value >= keyframes.rightBeforeCurrent && animationValue.value <= keyframes.rightAfterCurrent) {
      flexDirection = 'row';
    }
    return { flexDirection, opacity };
  });

  return (
    <Animated.View style={[styles.smallCard, carouselItemWrapperAnimatedStyles]}>
      <Bar style={styles.barStyle} disableShadow>
        <Animated.View style={[styles.barImageWrapper, imageAnimatedStyles]}>{tariffsImages[item]}</Animated.View>
        <View>
          <Animated.View style={[styles.barTitleContainer, titleAnimatedStyles]}>
            <Text style={styles.barTitleText}>{item}</Text>
            <Text style={styles.barTitleText}>$98.80</Text>
          </Animated.View>
          <Animated.View style={[styles.barBasicInfo, desriptionAnimatedStyles]}>
            <Animated.View style={[styles.barInfoItem, opacityAnimatedStyles]}>
              <PassengerIcon2 />
              <Text style={[styles.barContentText, computedStyles.barContentText]}>
                {t('ride_Ride_TariffsCarousel_passangerCapacity', { minNum: 1, maxNum: 3 })}
              </Text>
            </Animated.View>
            <View style={styles.barInfoItem}>
              <ClockIcon />
              <Text style={[styles.barContentText, computedStyles.barContentText]}>
                {t('ride_Ride_TariffsCarousel_minutes', { count: 8 })}
              </Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.barAdditionalInfo, opacityAnimatedStyles]}>
            <View style={styles.barInfoItem}>
              <BaggageIcon />
              <Text style={[styles.barContentText, computedStyles.barContentText]}>
                {t('ride_Ride_TariffsCarousel_carryOnBaggage')}
              </Text>
            </View>
          </Animated.View>
        </View>
        <Animated.View style={opacityAnimatedStyles}>
          <Button text={t('ride_Ride_TariffsCarousel_selectButton')} />
        </Animated.View>
      </Bar>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    position: 'absolute',
    bottom: sizes.paddingVertical,
    left: 0,
    right: 0,
  },
  carouselContentWrapper: {
    width: windowWidth,
    alignItems: 'flex-end',
  },
  smallCard: {
    minWidth: cardSizes.small.width,
    minHeight: cardSizes.small.height,
  },
  barStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  barImage: {
    width: 160,
    height: 103,
    objectFit: 'contain',
  },
  barImageWrapper: {
    marginTop: -(sizes.paddingVertical + 32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  barTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    alignItems: 'center',
  },
  barTitleText: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  barBasicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: -4,
  },
  barContentText: {
    fontSize: 12,
  },
  barInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barAdditionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: -4,
    marginTop: 10,
  },
});

export default TariffsCarousel;
