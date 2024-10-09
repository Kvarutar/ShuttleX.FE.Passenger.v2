import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Bar, BarModes, TariffType, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';

import { TariffGroupName, TariffGroupProps } from './props';

const tariffsGroupImagesNames: Record<TariffGroupName, TariffType> = {
  Economy: 'Eco',
  Exclusive: 'ComfortPlus',
  Business: 'Business',
};

const TariffGroup = ({
  price,
  title,
  mode = BarModes.Disabled,
  onPress,
  style,
  isAvailableTariffGroup,
}: TariffGroupProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const iconsData = useTariffsIcons();
  const groupImageName = tariffsGroupImagesNames[title];
  const IconComponent = iconsData[groupImageName].icon;

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    price: {
      color: colors.textSecondaryColor,
    },
    container: {
      borderColor: mode === BarModes.Disabled ? 'transparent' : colors.borderColor,
      borderWidth: 1,
      opacity: isAvailableTariffGroup ? 1 : 0.3,
    },
  });

  return (
    <Bar
      mode={mode}
      onPress={isAvailableTariffGroup ? onPress : undefined}
      style={[styles.container, computedStyles.container, style]}
    >
      <Text style={[styles.title, computedStyles.title]}>{title}</Text>
      <Text style={[styles.price, computedStyles.price]}>
        {isAvailableTariffGroup ? `~$${price}` : t('ride_Ride_TariffGroup_notAvailable')}
      </Text>
      <IconComponent style={styles.img} />
    </Bar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 130,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  img: {
    position: 'absolute',
    width: '170%',
    height: undefined,
    aspectRatio: 3.15,
    bottom: 16,
    left: 20,
  },
});

export default TariffGroup;
