import { Image, StyleSheet, View } from 'react-native';
import { PrizePedestalIcon, Text, TextElipsizeMode, useTheme } from 'shuttlex-integration';

import passengerColors from '../../../shared/colors/colors';
import { Prize } from './types';

const getPrizeByPlace = (prizes: Prize[], place: number) => {
  return prizes.find(prize => prize.index === place);
};

const PrizePodium = ({ prizes }: { prizes: Prize[] }) => {
  const { colors } = useTheme();

  const firstPrize = getPrizeByPlace(prizes, 1);
  const secondPrize = getPrizeByPlace(prizes, 2);
  const thirdPrize = getPrizeByPlace(prizes, 3);
  const firstPlaceWinner = firstPrize?.winnerProfile;
  const secondPlaceWinner = secondPrize?.winnerProfile;
  const thirdPlaceWinner = thirdPrize?.winnerProfile;

  const computedStyles = StyleSheet.create({
    surpriseTitle: {
      color: colors.textTertiaryColor,
    },
    surpriseTitleContainer: {
      backgroundColor: passengerColors.raffle.surpriseTitleBackgroundColor,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.prizes}>
        {/* 2nd Place */}
        <View style={[styles.prizeBox, styles.secondPlace]}>
          {secondPrize && (
            <>
              <Image source={secondPrize.image} style={styles.prizeImage} />
              <View style={[styles.surpriseTitleContainer, computedStyles.surpriseTitleContainer]}>
                <Text style={[styles.surpriseTitle, computedStyles.surpriseTitle]} numberOfLines={1}>
                  {secondPrize.name}
                </Text>
              </View>
            </>
          )}
          {secondPlaceWinner && (
            <Image source={{ uri: secondPlaceWinner.imageUrl }} style={styles.userImageSecondPlace} />
          )}
        </View>

        {/* 1st Place */}
        <View style={[styles.prizeBox, styles.firstPlace]}>
          {firstPrize && (
            <>
              <Image source={firstPrize.image} style={[styles.prizeImage, styles.firstPlacePrize]} />
              <View style={[styles.surpriseTitleContainer, computedStyles.surpriseTitleContainer]}>
                <Text style={[styles.surpriseTitle, computedStyles.surpriseTitle]} numberOfLines={1}>
                  {firstPrize.name}
                </Text>
              </View>
            </>
          )}
          {firstPlaceWinner && <Image source={{ uri: firstPlaceWinner.imageUrl }} style={styles.userImageFirstPlace} />}
        </View>

        {/* 3rd Place */}
        <View style={[styles.prizeBox, styles.thirdPlace]}>
          {thirdPrize && (
            <>
              <Image source={thirdPrize.image} style={styles.prizeImage} />
              <View style={[styles.surpriseTitleContainer, computedStyles.surpriseTitleContainer]}>
                <Text
                  style={[styles.surpriseTitle, computedStyles.surpriseTitle]}
                  elipsizeMode={TextElipsizeMode.Clip}
                  numberOfLines={1}
                >
                  {thirdPrize.name}
                </Text>
              </View>
            </>
          )}

          {thirdPlaceWinner && <Image source={{ uri: thirdPlaceWinner.imageUrl }} style={styles.userImageThirdPlace} />}
        </View>
      </View>
      <PrizePedestalIcon
        firstPlaceColored={Boolean(firstPlaceWinner)}
        secondPlaceColored={Boolean(secondPlaceWinner)}
        thirdPlaceColored={Boolean(thirdPlaceWinner)}
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
