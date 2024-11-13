import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { PassengerDefaultCarImage, sizes, Text, useTheme } from 'shuttlex-integration';

import imageStartRideCarouselCapybara from '../../../../../../../assets/images/startRide/imageStartRideCarouselCapybara';
import ImageStartRideCarouselPrize from '../../../../../../../assets/images/startRide/imageStartRideCarouselPrize';
import usePrizeTimer from '../utils/usePrizeTimer';
import { SliderItemProps } from './types';

const windowWidth = Dimensions.get('window').width;
const carouselAnimationDurations = 300;

const testEndLotteryTime = new Date(2024, 11, 1);

const SliderItem = ({ topText, bottomText, image }: SliderItemProps) => {
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
        <Text style={[styles.text, computedStyles.bottomText]}>{bottomText}</Text>
      </View>
      {image}
    </View>
  );
};

const HeaderCarousel = () => {
  const { t } = useTranslation();
  const carouselRef = useRef<ICarouselInstance>(null);
  const { hours, minutes, seconds } = usePrizeTimer(testEndLotteryTime);

  const [currentIndex, setCurrentIndex] = useState(0);

  const computedStyles = StyleSheet.create({
    carousel: {
      width: windowWidth,
      marginLeft: -sizes.paddingHorizontal,
    },
  });

  const carouselData = [
    {
      topText: t('ride_Ride_StartRideVisible_carouselFistSlideTopText'),
      bottomText: t('ride_Ride_StartRideVisible_carouselFistSlideBottomText'),
      image: <PassengerDefaultCarImage style={styles.carImage} />,
    },
    {
      topText: t('ride_Ride_StartRideVisible_carouselSecondSlideTopText'),
      bottomText: `${hours}${t('ride_Ride_StartRide_hours')}:${minutes}${t('ride_Ride_StartRide_minutes')}:${seconds}${t('ride_Ride_StartRide_seconds')}`,
      image: <Image source={ImageStartRideCarouselPrize} style={styles.prizeImage} />,
    },
    {
      topText: t('ride_Ride_StartRideVisible_carouselThirdSlideTopText'),
      bottomText: t('ride_Ride_StartRideVisible_carouselThirdSlideBottomText'),
      image: <Image source={imageStartRideCarouselCapybara} style={styles.capybaraImage} />,
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
        width={windowWidth}
        height={82} // height of SliderItemContainer
        style={computedStyles.carousel}
        data={carouselData}
        onSnapToItem={index => setCurrentIndex(index)}
        scrollAnimationDuration={carouselAnimationDurations}
        renderItem={({ item }) => <SliderItem topText={item.topText} bottomText={item.bottomText} image={item.image} />}
      />
      <View style={styles.dotsContainer}>{renderDots}</View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  carImage: {
    resizeMode: 'contain',
    aspectRatio: 3,
    flexShrink: 1,
    width: '40%',
    height: undefined,
    alignSelf: 'flex-end',
  },
  prizeImage: {
    resizeMode: 'contain',
    aspectRatio: 3,
    flexShrink: 1,
    width: '35%',
    height: undefined,
    alignSelf: 'flex-end',
  },
  capybaraImage: {
    width: 60,
    height: 75,
    marginTop: -13,
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
