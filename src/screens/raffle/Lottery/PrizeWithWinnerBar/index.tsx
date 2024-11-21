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

//TODO: add ImageComponent with default image
const defaultImage =
  'https://s3-alpha-sig.figma.com/img/9446/d564/bd2ec06179682d62415780b8d0976216?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=asXkku9hzOkD4gS295RqStzvF937gRSwT~REzBfzcaGAh8NoH97Mc5SPoaPWSutgbYwoqaDTMZMH6P-WaoQdTEnfPjtdh5esnXPpGcrBFEQsFkPRVlqsmicS-Qi2Bf5bUP~I4pA7rtlrd0dBGipsXdIo8sUVClkDBOWqnJi7JnA2VQ-oP9MbzV82Vifdgm~WZA1tra2t5syPQwZ0Drk3o9LeKnAVx6D11fpYZ7ziwd~ror22dnHNibb0zrGg4Hbe7yu3-V1nP-NS3zG89aT75lZFBIJYKCQLLfwWrtwVdhicqxCgzwVgNcjnqsUBJF~YMILZ1OPHPT5N4i86sHYTCQ__';

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
            <Image source={{ uri: winnerAvatar ?? defaultImage }} style={styles.winnerImage} />
          )}
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
