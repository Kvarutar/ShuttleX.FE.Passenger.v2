import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Bar, BarModes, BusinessImage, ComfortPlusImage, EcoImage, Text, useTheme } from 'shuttlex-integration';

import { TariffGroupProps } from './props';

const tariffsGroupImages: { [key: string]: ReactNode } = {
  Economy: <EcoImage />,
  Exclusive: <ComfortPlusImage />,
  Business: <BusinessImage />,
};

const TariffGroup = ({ price, title, mode = BarModes.Disabled, onPress, style }: TariffGroupProps) => {
  const { colors } = useTheme();

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
    },
  });

  return (
    <Bar mode={mode} onPress={onPress} style={[styles.container, computedStyles.container, style]}>
      <Text style={[styles.title, computedStyles.title]}>{title}</Text>
      <Text style={[styles.price, computedStyles.price]}>~${price}</Text>
      <View style={styles.img}>{tariffsGroupImages[title]}</View>
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
    marginBottom: 2,
  },
  price: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
  },
  img: {
    position: 'absolute',
    bottom: 16,
    left: 32,
  },
});

export default TariffGroup;
