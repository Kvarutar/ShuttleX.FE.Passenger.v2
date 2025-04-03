import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import { AnimatedCarImage, sizes, Skeleton, Text, useTheme, WINDOW_WIDTH } from 'shuttlex-integration';

import imageStartRideCarouselBinance from '../../../../../../../assets/images/startRide/imageStartRideCarouselBinance';
import imageStartRideCarouselPrize from '../../../../../../../assets/images/startRide/imageStartRideCarouselPrize';
import { isLotteryLoadingSelector, lotteryStartTimeSelector } from '../../../../../../core/lottery/redux/selectors';
import { isLoadingStubVisibleSelector } from '../../../../../../core/passenger/redux/selectors';
import usePrizeTimer from '../utils/usePrizeTimer';
import { SliderItemProps } from './types';

const carouselAnimationDurations = 300;

const SliderItem = ({ topText, bottomText, image, isTextLoading }: SliderItemProps) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    topText: {
      color: colors.textPrimaryColor,
    },
    bottomText: {
      color: colors.textTitleColor,
    },
    container: {
      marginHorizontal: sizes.paddingHorizontal,
    },
  });

  return (
    <View style={[styles.container, computedStyles.container]}>
      <View style={styles.textContainer}>
        <Text style={[styles.text, computedStyles.topText]}>{topText}</Text>
        {isTextLoading ? (
          <Skeleton skeletonContainerStyle={styles.skeletonUpcomingLotteryStartTime} />
        ) : (
          <Text style={[styles.text, computedStyles.bottomText]}>{bottomText}</Text>
        )}
      </View>
      {image}
    </View>
  );
};

const HeaderCarousel = () => {
  const { t } = useTranslation();
  const carouselRef = useRef<ICarouselInstance>(null);
  const lotteryStartTime = useSelector(lotteryStartTimeSelector);
  const isLotteryLoading = useSelector(isLotteryLoadingSelector);
  const isLoadingStubVisible = useSelector(isLoadingStubVisibleSelector);

  const { hours, minutes, seconds } = usePrizeTimer(new Date(lotteryStartTime ?? 0));

  const [currentIndex, setCurrentIndex] = useState(0);

  const computedStyles = StyleSheet.create({
    carousel: {
      width: WINDOW_WIDTH,
      marginLeft: -sizes.paddingHorizontal,
    },
  });

  const carouselData = [
    {
      topText: t('ride_Ride_StartRideVisible_carouselFistSlideTopText'),
      bottomText: t('ride_Ride_StartRideVisible_carouselFistSlideBottomText'),
      image: (
        <AnimatedCarImage
          tariffType="Default"
          containerStyle={styles.animatedCarImageContainer}
          withAnimation={!isLoadingStubVisible}
          leaveInStartPosition
        />
      ),
    },
    {
      topText: t('ride_Ride_StartRideVisible_carouselSecondSlideTopText'),
      bottomText: `${hours}${t('ride_Ride_StartRide_hours')}:${minutes}${t('ride_Ride_StartRide_minutes')}:${seconds}${t('ride_Ride_StartRide_seconds')}`,
      image: <Image source={imageStartRideCarouselPrize} style={styles.prizeImage} />,
    },
    {
      topText: t('ride_Ride_StartRideVisible_carouselThirdSlideTopText'),
      bottomText: t('ride_Ride_StartRideVisible_carouselThirdSlideBottomText'),
      image: <Image source={imageStartRideCarouselBinance} style={styles.bitcoinImage} />,
    },
  ];

  const handleDotPress = (index: number) => () => {
    setCurrentIndex(index);
    carouselRef.current?.scrollTo({ index, animated: true });
  };

  const renderDots = carouselData.map((_, index) => {
    const renderDotsComputedStyles = StyleSheet.create({
      dot: {
        opacity: currentIndex === index ? 1 : 0.15,
      },
    });

    return (
      <Pressable onPress={handleDotPress(index)} hitSlop={5} key={index}>
        <View style={[styles.dot, renderDotsComputedStyles.dot]} />
      </Pressable>
    );
  });

  return (
    <View style={styles.carouselWrapper}>
      <Carousel
        loop
        ref={carouselRef}
        width={WINDOW_WIDTH}
        height={82} // height of SliderItemContainer
        style={computedStyles.carousel}
        data={carouselData}
        onSnapToItem={index => setCurrentIndex(index)}
        scrollAnimationDuration={carouselAnimationDurations}
        renderItem={({ item, index }) => (
          <SliderItem
            topText={item.topText}
            bottomText={item.bottomText}
            image={item.image}
            isTextLoading={isLotteryLoading && index === 1}
          />
        )}
      />
      <View style={styles.dotsContainer}>{renderDots}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonUpcomingLotteryStartTime: {
    width: 150,
    height: 21,
    borderRadius: 4,
  },
  carouselWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  textContainer: {
    flexDirection: 'column',
    gap: 2,
  },
  text: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
    lineHeight: 22,
  },
  animatedCarImageContainer: {
    width: '40%',
  },
  prizeImage: {
    resizeMode: 'contain',
    aspectRatio: 3,
    flexShrink: 1,
    width: '35%',
    height: undefined,
    alignSelf: 'flex-end',
  },
  bitcoinImage: {
    width: 64,
    height: 64,
    marginTop: -10,
    resizeMode: 'contain',
  },
  dotsContainer: {
    gap: 10,
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: '#000',
  },
});

export default HeaderCarousel;
