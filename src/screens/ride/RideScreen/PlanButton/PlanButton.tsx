import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Bar, BarModes, getCurrencySign, LightningIcon, Text, useTheme } from 'shuttlex-integration';

import { PlanButtonProps } from './types';

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
    price: {
      color: isSelected ? colors.textTertiaryColor : colors.textSecondaryColor,
    },
    time: {
      color: colors.textTitleColor,
    },
    container: {
      backgroundColor: isSelected ? colors.backgroundTertiaryColor : colors.backgroundSecondaryColor,
    },
  });

  const formatTime = (time: number) => {
    const totalMinutes = Math.floor(time / 60);

    return `~${t('ride_Ride_PlanButton_minutes', { count: totalMinutes })}`;
  };

  return (
    <Bar onPress={onPress} style={[styles.container, computedStyles.container, style]} mode={BarModes.Disabled}>
      <Text style={[styles.time, computedStyles.time]}>
        {withTimeShow ? formatTime(Number(plan.DurationSec)) : tariffModes[plan.AlgorythmType]}
      </Text>
      <Text style={[styles.price, computedStyles.price]}>
        {/*TODO: swap currencyCode to correct value*/}
        {getCurrencySign('UAH')}
        {planPriceCounting(Number(plan.DurationSec), plan.AlgorythmType)}
      </Text>
      {plan.AlgorythmType === 'Eager Fast' && <LightningIcon style={styles.icon} />}
    </Bar>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexBasis: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
