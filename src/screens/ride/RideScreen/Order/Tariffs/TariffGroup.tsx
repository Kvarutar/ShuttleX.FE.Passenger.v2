import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { AnimatedCarImage, getCurrencySign, Skeleton, TariffType, Text, useTheme } from 'shuttlex-integration';

import { isTariffsPricesLoadingSelector } from '../../../../../core/ride/redux/offer/selectors';
import { TariffsType } from '../../../../../core/ride/redux/offer/types';
import passengerColors from '../../../../../shared/colors/colors';
import { TariffGroupProps } from './types';

const animationDuration = 300;

const TariffGroup = ({ price, title, isSelected, onPress, style, carsAnimationDelayInMilSec }: TariffGroupProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const isTariffsPricesLoading = useSelector(isTariffsPricesLoadingSelector);

  const tariffsGroupImagesNames: Record<TariffsType, { title: TariffsType; image: Exclude<TariffType, 'Business'> }> = {
    economy: {
      title: t('ride_Ride_TariffGroup_economy'),
      image: 'Basic',
    },
    comfort: {
      title: t('ride_Ride_TariffGroup_comfort'),
      image: 'ComfortPlus',
    },
    //TODO: Add this object when work with business
    // business: {
    //   title: t('ride_Ride_TariffGroup_business'),
    //   image: 'Business',
    // },
  };

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    price: {
      color: colors.textSecondaryColor,
    },
  });

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isSelected ? colors.backgroundPrimaryColor : colors.backgroundSecondaryColor, {
      duration: animationDuration,
    }),
    borderColor: withTiming(isSelected ? colors.borderColor : 'transparent', {
      duration: animationDuration,
    }),
  }));

  return (
    <Pressable style={[styles.wrapper, style]} onPress={onPress}>
      <Animated.View style={[styles.container, animatedStyles]}>
        <Text style={[styles.title, computedStyles.title]}>{tariffsGroupImagesNames[title].title}</Text>
        {isTariffsPricesLoading ? (
          <Skeleton
            skeletonContainerStyle={styles.skeletonTariffPrice}
            boneColor={
              isSelected ? colors.skeletonBoneColor : passengerColors.tariffsColors.tariffGroupPriceLoadingColor
            }
          />
        ) : (
          <Text style={[styles.price, computedStyles.price]}>
            {/*TODO: swap currencyCode to correct value*/}
            {getCurrencySign('UAH')}
            {price}
          </Text>
        )}
        <AnimatedCarImage
          tariffType={tariffsGroupImagesNames[title].image}
          containerStyle={styles.animatedCarImageContainer}
          startDelayInMilSec={carsAnimationDelayInMilSec}
          withAnimation={!isTariffsPricesLoading}
          leaveInStartPosition
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  skeletonTariffPrice: {
    width: 60,
    height: 20,
    borderRadius: 4,
  },
  wrapper: {
    flex: 1,
    height: 130,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  title: {
    fontFamily: 'Inter Bold',
    fontSize: 14,
    lineHeight: 16,
  },
  price: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  animatedCarImageContainer: {
    width: '170%',
    bottom: 16,
    left: 20,
  },
});

export default TariffGroup;
