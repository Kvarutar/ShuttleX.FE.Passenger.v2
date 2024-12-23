import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Bar, BarModes, LoadingSpinner, LoadingSpinnerIconModes, Text, useTheme } from 'shuttlex-integration';

import { isAvatarLoadingSelector, winnerAvatarSelector } from '../../../../core/lottery/redux/selectors';
import { getWinnerAvatar } from '../../../../core/lottery/redux/thunks';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { PrizeWithWinnerBarProps } from './types';

const PrizeWithWinnerBar = ({
  prizeId,
  winnerId,
  index,
  prizeImage,
  prizeTitle,
  ticketCode,
  winnerName,
}: PrizeWithWinnerBarProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const isAvatarLoading = useSelector(isAvatarLoadingSelector(winnerId));
  const winnerAvatar = useSelector(winnerAvatarSelector(winnerId));

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

  useEffect(() => {
    if (winnerId) {
      dispatch(getWinnerAvatar({ winnerId: winnerId, prizeId: prizeId }));
    }
  }, [dispatch, prizeId, winnerId]);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.wrapper}>
      <Bar style={styles.bar} mode={BarModes.Default}>
        <View style={styles.content}>
          <Image source={prizeImage} style={styles.prizeImage} />
          {isAvatarLoading ? (
            <View style={styles.loadingSpinnerContainer}>
              <LoadingSpinner iconMode={LoadingSpinnerIconModes.Mini} startColor={colors.backgroundPrimaryColor} />
            </View>
          ) : (
            <Image
              source={winnerAvatar ? { uri: winnerAvatar } : require('../../../../../assets/images/DefaultAvatar.png')}
              style={styles.winnerImage}
            />
          )}
          <View style={styles.contentText}>
            <Text style={[styles.text, styles.winnerName, computedStyles.winnerName]}>
              {ticketCode
                ? t('raffle_Lottery_PrizeWithWinnerBar_name', {
                    name: winnerName,
                    ticketCode: ticketCode ?? '...',
                  })
                : t('raffle_Lottery_noWinner')}
            </Text>
            <Text style={[styles.text, styles.prizeTitle, computedStyles.prizeTitle]}>{prizeTitle}</Text>
          </View>
        </View>
        <Text style={[styles.placeNumber, computedStyles.placeNumber]}>{index}</Text>
      </Bar>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  bar: {
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
  loadingSpinnerContainer: {
    width: 44,
  },
});

export default PrizeWithWinnerBar;
