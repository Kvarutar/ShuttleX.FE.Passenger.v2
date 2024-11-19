import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Bar, BarModes, Text, useTheme } from 'shuttlex-integration';

import { PrizeWithWinnerBarProps } from './types';

const PrizeWithWinnerBar = ({
  winnerImage,
  winnerName,
  index,
  prizeImage,
  prizeTitle,
  ticketCode,
}: PrizeWithWinnerBarProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    winnerName: {
      color: colors.textSecondaryColor,
    },
    prizeTitle: {
      color: colors.textPrimaryColor,
    },
    placeNumber: {
      color: colors.iconQuadraticColor,
    },
  });
  return (
    <Bar style={styles.bar} mode={BarModes.Default}>
      <View style={styles.content}>
        <Image source={prizeImage} style={styles.prizeImage} />
        <Image source={{ uri: winnerImage }} style={styles.winnerImage} />
        <View style={styles.contentText}>
          <Text style={[styles.text, styles.winnerName, computedStyles.winnerName]}>
            {t('raffle_Lottery_PrizeWithWinnerBar_name', {
              name: winnerName,
              ticketCode: ticketCode ?? '...',
            })}
          </Text>
          <Text style={[styles.text, styles.prizeTitle, computedStyles.prizeTitle]}>{prizeTitle}</Text>
        </View>
      </View>
      <Text style={[styles.placeNumber, computedStyles.placeNumber]}>{index}</Text>
    </Bar>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 82,
    paddingRight: 16,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentText: {
    justifyContent: 'space-between',
  },
  prizeImage: {
    width: 44,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  winnerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  text: {
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  winnerName: {
    fontSize: 14,
  },
  prizeTitle: {
    fontSize: 17,
  },
  placeNumber: {
    fontFamily: 'Inter Bold',
    fontSize: 50,
  },
});

export default PrizeWithWinnerBar;
