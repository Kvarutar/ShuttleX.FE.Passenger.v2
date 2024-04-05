import React, { ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, interpolate } from 'react-native-reanimated';
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

import { useAppDispatch } from '../../../../core/redux/hooks';
import { setOrderStatus, setTripTariff } from '../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../core/ride/redux/order/types';

const windowWidth = Dimensions.get('window').width;

const cardSizes = {
  width: 238,
  height: 274,
};

const TariffsCarousel = () => {
  const tariffs: TariffType[] = ['BasicX', 'BasicXL', 'PremiumXL', 'ComfortX', 'PremiumX', 'PremiumXL', 'TeslaX']; //for test only

  const animationStyle = useCallback((value: number) => {
    'worklet';

    const scale = interpolate(value, [-1, 0, 1], [0.8, 1, 0.8]);
    const translateX = interpolate(value, [-1, 0, 1], [-cardSizes.width, 0, cardSizes.width]);

    return {
      transform: [{ translateX }, { scale }],
    };
  }, []);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.carouselWrapper}>
      <Carousel
        loop={false}
        style={styles.carouselContentWrapper}
        width={cardSizes.width}
        height={320}
        data={[...tariffs]}
        customAnimation={animationStyle}
        scrollAnimationDuration={300}
        renderItem={({ item }) => <CarouselItem item={item} />}
      />
    </Animated.View>
  );
};

const CarouselItem = ({ item }: { item: TariffType }) => {
  const { colors } = useTheme();
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

  const onTariffSelect = () => {
    dispatch(setTripTariff(item));
    dispatch(setOrderStatus(OrderStatus.Confirming));
  };

  return (
    <Animated.View style={styles.carouselItemWrapper}>
      <Bar style={styles.barStyle} disableShadow>
        <Animated.View style={[styles.barImageWrapper]}>{tariffsImages[item]}</Animated.View>
        <View>
          <Animated.View style={[styles.barTitle]}>
            <Text style={styles.barTitleText}>{item}</Text>
            <Text style={styles.barTitleText}>$98.80</Text>
          </Animated.View>
          <Animated.View style={[styles.barBasicInfo]}>
            <Animated.View style={[styles.barInfoItem]}>
              <PassengerIcon2 />
              <Text style={[styles.barContentText, computedStyles.barContentText]}>
                {t('ride_Ride_TariffsCarousel_passengerCapacity', { minNum: 1, maxNum: 3 })}
              </Text>
            </Animated.View>
            <View style={styles.barInfoItem}>
              <ClockIcon />
              <Text style={[styles.barContentText, computedStyles.barContentText]}>
                {t('ride_Ride_TariffsCarousel_minutes', { count: 8 })}
              </Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.barAdditionalInfo]}>
            <View style={styles.barInfoItem}>
              <BaggageIcon />
              <Text style={[styles.barContentText, computedStyles.barContentText]}>
                {t('ride_Ride_TariffsCarousel_carryOnBaggage')}
              </Text>
            </View>
          </Animated.View>
        </View>
        <Animated.View>
          <Button text={t('ride_Ride_TariffsCarousel_selectButton')} onPress={onTariffSelect} />
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
  },
  carouselItemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 0,
    marginLeft: sizes.paddingHorizontal * 2,
  },
  barStyle: {
    justifyContent: 'space-between',
    overflow: 'visible',
    width: cardSizes.width,
    height: cardSizes.height,
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
  barTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    flexWrap: 'wrap',
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
