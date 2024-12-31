import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Text, useTheme } from 'shuttlex-integration';

import { winnerAvatarSelector } from '../../../../core/lottery/redux/selectors';
import { getWinnerAvatar } from '../../../../core/lottery/redux/thunks';
import { useAppDispatch } from '../../../../core/redux/hooks';
import passengerColors from '../../../../shared/colors/colors';
import { prizesData } from '../prizesData';
import { prizeBoxPropertiesType, PrizeBoxProps } from './types';

const prizeBoxProperties: Record<number, prizeBoxPropertiesType> = {
  0: {
    userImage: {
      position: 'absolute',
      bottom: 32,
      right: -10,
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    container: {
      top: -40,
    },
  },
  1: {
    userImage: {
      position: 'absolute',
      bottom: 32,
      left: -12,
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    container: {
      top: -15,
    },
  },
  2: {
    userImage: {
      position: 'absolute',
      bottom: 32,
      right: 0,
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    container: {
      top: 0,
    },
  },
};

const PrizeBox = ({ prize, onPress }: PrizeBoxProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const avatar = useSelector(winnerAvatarSelector(prize?.winnerId));

  const prizeData = prizesData[prize.prizes[0].feKey];
  const prizeStyle = prizeBoxProperties[prize.index];

  useEffect(() => {
    if (prize?.winnerId && !avatar) {
      dispatch(getWinnerAvatar({ winnerId: prize.winnerId, prizeId: prize.prizes[0].prizeId }));
    }
  }, [dispatch, prize?.winnerId, avatar, prize?.prizes]);

  return (
    <View style={[styles.prizeBox, prizeStyle.container]}>
      {prize && (
        <Pressable onPress={onPress}>
          <Image source={prizeData.image} style={[styles.subPrizeImage, prize.index === 0 && styles.mainPrizeImage]} />
          <View
            style={[
              styles.surpriseTitleContainer,
              { backgroundColor: passengerColors.raffle.surpriseTitleBackgroundColor },
            ]}
          >
            <Text style={[styles.surpriseTitle, { color: colors.textTertiaryColor }]} numberOfLines={1}>
              {prize?.winnerId ? prize?.winnerFirstName : t(prizeData.name)}
            </Text>
          </View>
        </Pressable>
      )}
      {prize?.winnerId && avatar && (
        <Animated.Image entering={FadeIn} source={{ uri: avatar }} style={prizeStyle.userImage} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  prizeBox: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  mainPrizeImage: {
    width: undefined,
    maxWidth: 180,
    height: 200,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  subPrizeImage: {
    width: undefined,
    maxWidth: 110,
    height: 130,
    aspectRatio: 0.7,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  surpriseTitleContainer: {
    alignSelf: 'center',
    borderRadius: 6,
    marginTop: -15,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  surpriseTitle: {
    fontFamily: 'Inter Medium',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
  },
});

export default PrizeBox;
