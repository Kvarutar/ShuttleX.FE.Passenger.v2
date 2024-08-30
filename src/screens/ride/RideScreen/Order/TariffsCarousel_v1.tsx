import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
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
  ButtonV1,
  ClockIcon,
  ComfortXImage,
  PassengerIcon2,
  PremiumXImage,
  PremiumXLImage,
  sizes,
  TariffType,
  TeslaXImage,
  Text,
  useThemeV1,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { setOrderStatus, setTripTariff } from '../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../core/ride/redux/order/types';

const tariffs: TariffType[] = ['BasicX', 'BasicXL', 'PremiumXL', 'ComfortX', 'PremiumX', 'PremiumXL', 'TeslaX']; //for test only

const windowWidth = Dimensions.get('window').width;

const cardSizes = {
  width: 238,
  height: 274,
};

const keyframes = {
  rightAfterPrevious: -0.8,
  rightBeforeCurrent: -0.2,
  rightAfterCurrent: 0.2,
  rightBeforeNext: 0.8,
};

type PivotPoint = {
  x: number;
  y: number;
};

const transformOriginWorklet = (anchorPoint: PivotPoint, originalCenterPoint: PivotPoint, transforms: any) => {
  //Function for applying pivot point in transformations
  'worklet';
  const result = [
    { translateX: anchorPoint.x - originalCenterPoint.x },
    { translateY: anchorPoint.y - originalCenterPoint.y },
    ...transforms,
    { translateX: -(anchorPoint.x - originalCenterPoint.x) },
    { translateY: -(anchorPoint.y - originalCenterPoint.y) },
  ];
  return result;
};

const TariffsCarousel = () => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.carouselWrapper}>
    <Carousel
      loop={false}
      style={styles.carouselContentWrapper}
      width={cardSizes.width}
      height={cardSizes.height}
      data={tariffs}
      scrollAnimationDuration={300}
      renderItem={({ item, animationValue }) => <CarouselItem animationValue={animationValue} item={item} />}
    />
  </Animated.View>
);

const CarouselItem = ({ animationValue, item }: { animationValue: SharedValue<number>; item: TariffType }) => {
  const { colors } = useThemeV1();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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
      {
        translateX: interpolate(animationValue.value, [-2, -1, 0, 1, 2], [-30, 20, 20, -20, -30], Extrapolation.CLAMP), //Custom space between cards
      },
    ],
  }));

  const barWrapperAnimatedStyles = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [-1, 0, 1], [0.5, 1.0, 0.5], Extrapolation.CLAMP);
    return {
      transform: transformOriginWorklet(
        { x: cardSizes.width, y: cardSizes.height },
        { x: cardSizes.width, y: cardSizes.height / 2.0 },
        [{ scale }],
      ),
    };
  });

  const opacityAnimatedStyles = useAnimatedStyle(() => ({
    opacity: interpolate(
      animationValue.value,
      [keyframes.rightBeforeCurrent, 0, keyframes.rightAfterCurrent],
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const imageAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(animationValue.value, [-1, 0, 1], [1.2, 1, 1.2], Extrapolation.CLAMP) }], //Negate scale for image in small state
  }));

  const titleAnimatedStyles = useAnimatedStyle(() => {
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
      [0, 0, 0, 1, 0, 0, 0],
      Extrapolation.CLAMP,
    );

    return { opacity };
  });

  const smallDescriptionAnimatedStyles = useAnimatedStyle(() => {
    const transform = [{ scale: interpolate(animationValue.value, [-1, 0, 1], [1.5, 1, 1.5], Extrapolation.CLAMP) }]; //Negate scale for description in small state
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
      [1, 0, 0, 0, 0, 0, 1],
      Extrapolation.CLAMP,
    );

    return { transform, opacity };
  });

  const onTariffSelect = () => {
    dispatch(setTripTariff(item));
    dispatch(setOrderStatus(OrderStatus.Confirming));
  };

  return (
    <Animated.View style={[styles.card, carouselItemWrapperAnimatedStyles]}>
      <Animated.View style={barWrapperAnimatedStyles}>
        <Bar style={styles.barStyle}>
          <Animated.View style={[styles.barImageWrapper, imageAnimatedStyles]}>{tariffsImages[item]}</Animated.View>
          <View>
            <Animated.View style={[styles.barTitleContainer, titleAnimatedStyles]}>
              <Text style={styles.barTitleText}>{item}</Text>
              <Text style={styles.barTitleText}>$98.80</Text>
            </Animated.View>
            <Animated.View style={[styles.barBasicInfo, opacityAnimatedStyles]}>
              <Animated.View style={styles.barInfoItem}>
                <PassengerIcon2 />
                <Text style={[styles.barContentText, computedStyles.barContentText]}>
                  {t('ride_Ride_TariffsCarousel_passengerCapacity', { minNum: 1, maxNum: 3 })}
                </Text>
              </Animated.View>
              <Animated.View style={styles.barInfoItem}>
                <ClockIcon />
                <Text style={[styles.barContentText, computedStyles.barContentText]}>
                  {t('ride_Ride_TariffsCarousel_minutes', { count: 8 })}
                </Text>
              </Animated.View>
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
            <ButtonV1 text={t('ride_Ride_TariffsCarousel_selectButton')} onPress={onTariffSelect} />
          </Animated.View>
          <Animated.View style={[styles.smallDescriptionContainer, smallDescriptionAnimatedStyles]}>
            <Text style={styles.barTitleText}>{item}</Text>
            <Text style={styles.barTitleText}>$98.80</Text>
            <View style={styles.barInfoItem}>
              <ClockIcon />
              <Text style={[styles.barContentText, computedStyles.barContentText]}>
                {t('ride_Ride_TariffsCarousel_minutes', { count: 8 })}
              </Text>
            </View>
          </Animated.View>
        </Bar>
      </Animated.View>
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
    overflow: 'visible',
  },
  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  barStyle: {
    width: cardSizes.width,
    height: cardSizes.height,
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
  smallDescriptionContainer: {
    position: 'absolute',
    bottom: sizes.paddingVertical,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 30,
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
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
