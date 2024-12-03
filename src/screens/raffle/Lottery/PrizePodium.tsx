import { useEffect } from 'react';
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

//TODO: add ImageComponent with default image
const defaultImage =
  'https://s3-alpha-sig.figma.com/img/9446/d564/bd2ec06179682d62415780b8d0976216?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=asXkku9hzOkD4gS295RqStzvF937gRSwT~REzBfzcaGAh8NoH97Mc5SPoaPWSutgbYwoqaDTMZMH6P-WaoQdTEnfPjtdh5esnXPpGcrBFEQsFkPRVlqsmicS-Qi2Bf5bUP~I4pA7rtlrd0dBGipsXdIo8sUVClkDBOWqnJi7JnA2VQ-oP9MbzV82Vifdgm~WZA1tra2t5syPQwZ0Drk3o9LeKnAVx6D11fpYZ7ziwd~ror22dnHNibb0zrGg4Hbe7yu3-V1nP-NS3zG89aT75lZFBIJYKCQLLfwWrtwVdhicqxCgzwVgNcjnqsUBJF~YMILZ1OPHPT5N4i86sHYTCQ__';

const PrizePodium = ({ prizes }: { prizes: Prize[] }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

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

  //TODO: change prizes data with the real one
  return (
    <View style={styles.container}>
      <View style={styles.prizes}>
        {/* 2nd Place */}
        <View style={[styles.prizeBox, styles.secondPlace]}>
          {secondPrize && (
            <>
              <Image source={prizesData['iPhone 16'].image} style={styles.prizeImage} />
              <View style={[styles.surpriseTitleContainer, computedStyles.surpriseTitleContainer]}>
                <Text style={[styles.surpriseTitle, computedStyles.surpriseTitle]} numberOfLines={1}>
                  {secondPrize?.winnerId ? secondPrize?.winnerFirstName : prizesData['iPhone 16'].name}
                </Text>
              </View>
            </>
          )}
          {secondPrize?.winnerId && (
            <Animated.Image
              entering={FadeIn}
              source={{ uri: secondPrizeAvatar ?? defaultImage }}
              style={styles.userImageSecondPlace}
            />
          )}
        </View>

        {/* 1st Place */}
        <View style={[styles.prizeBox, styles.firstPlace]}>
          {firstPrize && (
            <>
              <Image source={prizesData['iPhone 16'].image} style={[styles.prizeImage, styles.firstPlacePrize]} />
              <View style={[styles.surpriseTitleContainer, computedStyles.surpriseTitleContainer]}>
                <Text style={[styles.surpriseTitle, computedStyles.surpriseTitle]} numberOfLines={1}>
                  {firstPrize?.winnerId ? firstPrize?.winnerFirstName : prizesData['iPhone 16'].name}
                </Text>
              </View>
            </>
          )}
          {firstPrize?.winnerId && (
            <Animated.Image
              entering={FadeIn}
              source={{ uri: firstPrizeAvatar ?? defaultImage }}
              style={styles.userImageFirstPlace}
            />
          )}
        </View>

        {/* 3rd Place */}
        <View style={[styles.prizeBox, styles.thirdPlace]}>
          {thirdPrize && (
            <>
              <Image source={prizesData['iPhone 16'].image} style={styles.prizeImage} />
              <View style={[styles.surpriseTitleContainer, computedStyles.surpriseTitleContainer]}>
                <Text
                  style={[styles.surpriseTitle, computedStyles.surpriseTitle]}
                  elipsizeMode={TextElipsizeMode.Clip}
                  numberOfLines={1}
                >
                  {thirdPrize?.winnerId ? thirdPrize?.winnerFirstName : prizesData['iPhone 16'].name}
                </Text>
              </View>
            </>
          )}
          {thirdPrize?.winnerId && (
            <Animated.Image
              entering={FadeIn}
              source={{ uri: thirdPrizeAvatar ?? defaultImage }}
              style={styles.userImageThirdPlace}
            />
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
  prizeImage: {
    width: 60,
    height: undefined,
    aspectRatio: '0.5',
  },
  firstPlacePrize: {
    width: 75,
  },
  userImageFirstPlace: {
    position: 'absolute',
    bottom: 32,
    right: -22,
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userImageSecondPlace: {
    position: 'absolute',
    bottom: 32,
    left: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userImageThirdPlace: {
    position: 'absolute',
    bottom: 32,
    right: -22,
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
