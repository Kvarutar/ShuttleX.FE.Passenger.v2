import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { getCurrencySign, TariffType, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';

import { TariffGroupName, TariffGroupProps } from './types';

const animationDuration = 300;

const TariffGroup = ({ price, title, isSelected, onPress, style, isAvailableTariffGroup }: TariffGroupProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const iconsData = useTariffsIcons();

  const tariffsGroupImagesNames: Record<TariffGroupName, { title: TariffGroupName; image: TariffType }> = {
    Economy: {
      title: t('ride_Ride_TariffGroup_economy'),
      image: 'Eco',
    },
    Exclusive: {
      title: t('ride_Ride_TariffGroup_exclusive'),
      image: 'ComfortPlus',
    },
    Business: {
      title: t('ride_Ride_TariffGroup_business'),
      image: 'Business',
    },
  };

  const IconComponent = iconsData[tariffsGroupImagesNames[title].image].icon;

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    price: {
      color: colors.textSecondaryColor,
    },
    wrapper: {
      opacity: isAvailableTariffGroup ? 1 : 0.3,
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
    <Pressable
      style={[styles.wrapper, computedStyles.wrapper, style]}
      onPress={isAvailableTariffGroup ? onPress : undefined}
    >
      <Animated.View style={[styles.container, animatedStyles]}>
        <Text style={[styles.title, computedStyles.title]}>{tariffsGroupImagesNames[title].title}</Text>
        <Text style={[styles.price, computedStyles.price]}>
          {/*TODO: swap currencyCode to correct value*/}
          {isAvailableTariffGroup ? `~${getCurrencySign('UAH')}${price}` : t('ride_Ride_TariffGroup_notAvailable')}
        </Text>
        <IconComponent style={styles.img} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
