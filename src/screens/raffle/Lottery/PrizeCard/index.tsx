import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet } from 'react-native';
import { Text, useTheme } from 'shuttlex-integration';

import { PrizeCardProps } from './types';

const PrizeCard = ({ item, onPress }: PrizeCardProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

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
    <Pressable style={[styles.container, computedStyles.container]} onPress={() => onPress(item)}>
      <Image source={item.image} style={styles.image} />
      <Text style={[styles.placeNumber, computedStyles.placeNumber]} numberOfLines={1}>
        {t('raffle_Lottery_PrizeCard_position', { pos: item.index })}
      </Text>
      <Text style={[styles.title, computedStyles.title]}>{item.name}</Text>
    </Pressable>
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
