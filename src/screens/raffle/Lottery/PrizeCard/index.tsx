import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text, useTheme } from 'shuttlex-integration';

import { prizesData } from '../prizesData';
import { PrizeCardProps } from './types';

const PrizeCard = ({ item, onPress }: PrizeCardProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const feKey = item.prizes[0].feKey;

  const computedStyles = StyleSheet.create({
    container: {
      borderColor: colors.borderColor,
    },
    placeNumber: {
      color: colors.textSecondaryColor,
    },
    title: {
      color: colors.textPrimaryColor,
    },
  });

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Pressable style={[styles.container, computedStyles.container]} onPress={() => onPress(item)}>
        <Image source={prizesData[feKey].image} style={styles.image} />
        <Text style={[styles.placeNumber, computedStyles.placeNumber]} numberOfLines={1}>
          {t('raffle_Lottery_PrizeCard_position', { pos: item.index + 1 })}
        </Text>
        <Text style={[styles.title, computedStyles.title]}>{t(prizesData[feKey].name)}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9,
    borderWidth: 0.5,
    gap: 6,
  },
  image: {
    alignSelf: 'center',
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  placeNumber: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  title: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
});

export default PrizeCard;
