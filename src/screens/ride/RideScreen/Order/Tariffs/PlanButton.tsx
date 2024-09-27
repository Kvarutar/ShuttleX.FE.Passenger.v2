import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Bar, BarModes, LightningIcon, Text, useTheme } from 'shuttlex-integration';

import { PlanButtonProps } from './props';

const PlanButton = ({ price, time, onPress, index, selectedPrice }: PlanButtonProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    price: {
      color: selectedPrice ? colors.textTertiaryColor : colors.textSecondaryColor,
    },
    time: {
      color: colors.textTitleColor,
    },
    container: {
      backgroundColor: selectedPrice ? colors.backgroundTertiaryColor : colors.backgroundSecondaryColor,
    },
  });

  return (
    <Bar onPress={onPress} style={[styles.container, computedStyles.container]} mode={BarModes.Disabled}>
      <Text style={[styles.time, computedStyles.time]}>~{t('ride_Ride_Tariffs_minutes', { count: Number(time) })}</Text>
      <Text style={[styles.price, computedStyles.price]}>${price}</Text>
      {index === 0 && <LightningIcon style={styles.icon} />}
    </Bar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  icon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  price: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },
  time: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
});

export default PlanButton;
