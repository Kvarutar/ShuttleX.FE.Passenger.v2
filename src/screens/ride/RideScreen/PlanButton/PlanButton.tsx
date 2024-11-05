import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { getCurrencySign, LightningIcon, Text, useTheme } from 'shuttlex-integration';

import { PlanButtonProps } from './types';

const animationDuration = 300;
// for test
export const planPriceCounting = (time: number, tariff: 'Eager Fast' | 'Hungarian' | 'Eager Cheap') => {
  const multiplier = {
    'Eager Fast': 3,
    Hungarian: 1,
    'Eager Cheap': 0.5,
  };

  return (time / 10) * multiplier[tariff];
};

const PlanButton = ({ plan, onPress, isSelected, style, withTimeShow = true }: PlanButtonProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const tariffModes = {
    'Eager Fast': t('ride_Ride_PlanButton_fast'),
    Hungarian: t('ride_Ride_PlanButton_average'),
    'Eager Cheap': t('ride_Ride_PlanButton_slow'),
  };

  const computedStyles = StyleSheet.create({
    time: {
      color: colors.textTitleColor,
    },
  });

  const animatedStyles = {
    price: useAnimatedStyle(() => ({
      color: withTiming(isSelected ? colors.textTertiaryColor : colors.textSecondaryColor, {
        duration: animationDuration,
      }),
    })),
    wrapper: useAnimatedStyle(() => ({
      backgroundColor: withTiming(isSelected ? colors.backgroundTertiaryColor : colors.backgroundSecondaryColor, {
        duration: animationDuration,
      }),
    })),
  };

  const formatTime = (time: number) => {
    const totalMinutes = Math.floor(time / 60);

    return `~${t('ride_Ride_PlanButton_minutes', { count: totalMinutes })}`;
  };

  return (
    <Pressable onPress={onPress} style={[styles.wrapper, style]}>
      <Animated.View style={[styles.container, animatedStyles.wrapper]}>
        <Text style={[styles.time, computedStyles.time]}>
          {withTimeShow ? formatTime(Number(plan.DurationSec)) : tariffModes[plan.AlgorythmType]}
        </Text>
        <Animated.Text style={[styles.price, animatedStyles.price]}>
          {/*TODO: swap currencyCode to correct value*/}
          {getCurrencySign('UAH')}
          {planPriceCounting(Number(plan.DurationSec), plan.AlgorythmType)}
        </Animated.Text>
        {plan.AlgorythmType === 'Eager Fast' && <LightningIcon style={styles.icon} />}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    flexBasis: 1,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  icon: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  price: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  time: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
});

export default PlanButton;
