import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { PrizePedestalIcon, Text, TextElipsizeMode, useTheme } from 'shuttlex-integration';

import { winnerAvatarSelector } from '../../../core/lottery/redux/selectors';
import { getWinnerAvatar } from '../../../core/lottery/redux/thunks';
import { Prize } from '../../../core/lottery/redux/types';
import { useAppDispatch } from '../../../core/redux/hooks';
import passengerColors from '../../../shared/colors/colors';
import { prizesData } from './prizesData';

const getPrizeByPlace = (prizes: Prize[], place: number) => {
  return prizes.find(prize => prize.index + 1 === place);
};

const PrizePodium = ({ prizes }: { prizes: Prize[] }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const firstPrize = getPrizeByPlace(prizes, 1);
  const secondPrize = getPrizeByPlace(prizes, 2);
  const thirdPrize = getPrizeByPlace(prizes, 3);

  const firstPrizeAvatar = useSelector(winnerAvatarSelector(firstPrize?.winnerId));
  const secondPrizeAvatar = useSelector(winnerAvatarSelector(secondPrize?.winnerId));
  const thirdPrizeAvatar = useSelector(winnerAvatarSelector(thirdPrize?.winnerId));

  const computedStyles = StyleSheet.create({
    surpriseTitle: {
      color: colors.textTertiaryColor,
    },
    surpriseTitleContainer: {
      backgroundColor: passengerColors.raffle.surpriseTitleBackgroundColor,
    },
  });

  useEffect(() => {
    if (firstPrize?.winnerId) {
      dispatch(getWinnerAvatar({ winnerId: firstPrize.winnerId, prizeId: firstPrize.prizes[0].prizeId }));
    }
  }, [dispatch, firstPrize?.prizes, firstPrize?.winnerId]);

  useEffect(() => {
    if (secondPrize?.winnerId) {
      dispatch(getWinnerAvatar({ winnerId: secondPrize.winnerId, prizeId: secondPrize.prizes[0].prizeId }));
    }
  }, [dispatch, secondPrize?.prizes, secondPrize?.winnerId]);

  useEffect(() => {
    if (thirdPrize?.winnerId) {
      dispatch(getWinnerAvatar({ winnerId: thirdPrize.winnerId, prizeId: thirdPrize.prizes[0].prizeId }));
    }
  }, [dispatch, thirdPrize?.prizes, thirdPrize?.winnerId]);

  return (
    <View style={styles.container}>
      <View style={styles.prizes}>
        {/* 2nd Place */}
        <View style={[styles.prizeBox, styles.secondPlace]}>
          {secondPrize && (
            <>
              <Image source={prizesData[secondPrize.prizes[0].feKey].image} style={styles.subPrizeImage} />
              <View style={[styles.surpriseTitleContainer, computedStyles.surpriseTitleContainer]}>
                <Text style={[styles.surpriseTitle, computedStyles.surpriseTitle]} numberOfLines={1}>
                  {secondPrize?.winnerId
                    ? secondPrize?.winnerFirstName
                    : t(prizesData[secondPrize.prizes[0].feKey].name)}
                </Text>
              </View>
            </>
          )}
          {secondPrize?.winnerId && secondPrizeAvatar && (
            <Animated.Image entering={FadeIn} source={{ uri: secondPrizeAvatar }} style={styles.userImageSecondPlace} />
          )}
        </View>

        {/* 1st Place */}
        <View style={[styles.prizeBox, styles.firstPlace]}>
          {firstPrize && (
            <>
              <Image
                source={prizesData[firstPrize.prizes[0].feKey].image}
                style={[styles.mainPrizeImage, styles.firstPlacePrize]}
              />
              <View style={[styles.surpriseTitleContainer, computedStyles.surpriseTitleContainer]}>
                <Text style={[styles.surpriseTitle, computedStyles.surpriseTitle]} numberOfLines={1}>
                  {firstPrize?.winnerId ? firstPrize?.winnerFirstName : t(prizesData[firstPrize.prizes[0].feKey].name)}
                </Text>
              </View>
            </>
          )}
          {firstPrize?.winnerId && firstPrizeAvatar && (
            <Animated.Image entering={FadeIn} source={{ uri: firstPrizeAvatar }} style={styles.userImageFirstPlace} />
          )}
        </View>

        {/* 3rd Place */}
        <View style={[styles.prizeBox, styles.thirdPlace]}>
          {thirdPrize && (
            <>
              <Image source={prizesData[thirdPrize.prizes[0].feKey].image} style={styles.subPrizeImage} />
              <View style={[styles.surpriseTitleContainer, computedStyles.surpriseTitleContainer]}>
                <Text
                  style={[styles.surpriseTitle, computedStyles.surpriseTitle]}
                  elipsizeMode={TextElipsizeMode.Clip}
                  numberOfLines={1}
                >
                  {thirdPrize?.winnerId ? thirdPrize?.winnerFirstName : t(prizesData[thirdPrize.prizes[0].feKey].name)}
                </Text>
              </View>
            </>
          )}
          {thirdPrize?.winnerId && thirdPrizeAvatar && (
            <Animated.Image entering={FadeIn} source={{ uri: thirdPrizeAvatar }} style={styles.userImageThirdPlace} />
          )}
        </View>
      </View>
      <PrizePedestalIcon
        firstPlaceColored={Boolean(firstPrize?.winnerId)}
        secondPlaceColored={Boolean(secondPrize?.winnerId)}
        thirdPlaceColored={Boolean(thirdPrize?.winnerId)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 55,
  },
  prizes: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: -70,
    width: 343,
    zIndex: 1,
  },
  prizeBox: {
    itemPosition: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  mainPrizeImage: {
    width: 100,
    maxWidth: 200,
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
  },
  firstPlacePrize: {
    width: 75,
  },
  userImageFirstPlace: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userImageSecondPlace: {
    position: 'absolute',
    bottom: 32,
    left: -12,
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userImageThirdPlace: {
    position: 'absolute',
    bottom: 32,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  surpriseTitleContainer: {
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
  firstPlace: {
    top: -40,
  },
  secondPlace: {
    top: -15,
  },
  thirdPlace: {
    top: 0,
  },
});

export default PrizePodium;
