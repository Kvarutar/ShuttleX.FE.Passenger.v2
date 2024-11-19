import { useCallback, useEffect, useState } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { BottomWindowWithGesture, GroupedButtons, SafeAreaView, sizes, useTheme } from 'shuttlex-integration';

import CountdownTimer from './CountDownTimer';
import { surprisesMock, winnersMock } from './mockData';
import PrizeCard from './PrizeCard';
import PrizePodium from './PrizePodium';
import PrizesSlider from './PrizesSlider';
import PrizeWithWinnerBar from './PrizeWithWinnerBar';
import { LotteryProps, Prize } from './types';

const windowHeight = Dimensions.get('window').height;

const Lottery = ({ triggerConfetti }: LotteryProps): JSX.Element => {
  const { colors } = useTheme();

  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [timeUntilLottery, setTimeUntilLottery] = useState<number>(0);

  const [isPrizeSelected, setIsPrizeSelected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

  const [isWinners, setIsWinners] = useState<boolean>(false);
  const mainPrizes = prizes.sort((a, b) => a.index - b.index).slice(0, 3);
  const otherPrizes = prizes.sort((a, b) => a.index - b.index).slice(3);

  const contentAnimatedHeight = useSharedValue(0);
  const podiumAnimatedHeight = useSharedValue(0);
  const bottomWindowMinHeight = useSharedValue(0);

  //TODO get data from back
  useEffect(() => {
    const startTime = 3032982400000;
    setTimeUntilLottery(startTime);
    setPrizes(surprisesMock);
    setIsWinners(prizes.some(prize => prize.winnerProfile));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //TODO get data from back
  useEffect(() => {
    setIsWinners(true);
    triggerConfetti();

    const initialDelay = setTimeout(() => {
      let index = 0;

      // add winners in 5 seconds timer
      const intervalId = setInterval(() => {
        setPrizes(prevPrizes => {
          const newPrizes = [...prevPrizes];
          const reverseIndex = newPrizes.length - 1 - index;
          if (reverseIndex >= 0) {
            newPrizes[reverseIndex].winnerProfile = winnersMock[reverseIndex];
            index += 1;
          } else {
            clearInterval(intervalId);
          }

          return newPrizes;
        });
      }, 5000);
    }, 10000);

    return () => clearTimeout(initialDelay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSurprisesPress = useCallback((prize: Prize) => {
    setSelectedPrize(prize);
    setModalVisible(true);
  }, []);

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    renderContainer: {
      flexDirection: isWinners ? 'column' : 'row',
      justifyContent: isWinners ? undefined : 'space-between',
    },
  });

  const renderContent = () => (
    <>
      <View style={[styles.renderContainer, computedStyles.renderContainer]}>
        {isPrizeSelected ? (
          otherPrizes.map(item => {
            const winner = item.winnerProfile;
            return isWinners ? (
              winner && (
                <PrizeWithWinnerBar
                  key={item.id}
                  prizeImage={item.image}
                  winnerImage={winner.imageUrl}
                  prizeTitle={item.name}
                  winnerName={winner.name}
                  index={item.index}
                />
              )
            ) : (
              <View key={item.id} style={styles.itemWrapper}>
                <PrizeCard item={item} onPress={handleSurprisesPress} />
              </View>
            );
          })
        ) : (
          <View>{/*TODO Add history block*/}</View>
        )}
      </View>
    </>
  );

  const onContentPartLayout = (e: LayoutChangeEvent) => {
    contentAnimatedHeight.value = e.nativeEvent.layout.height;
  };

  const onPodiumPartLayout = (e: LayoutChangeEvent) => {
    podiumAnimatedHeight.value = e.nativeEvent.layout.height;
  };

  useDerivedValue(() => {
    bottomWindowMinHeight.value =
      (contentAnimatedHeight.value - podiumAnimatedHeight.value + sizes.paddingVertical) / windowHeight;
  });

  return (
    <>
      <SafeAreaView>
        <View style={styles.podiumContainer} onLayout={onContentPartLayout}>
          <View onLayout={onPodiumPartLayout}>
            {!isWinners && <CountdownTimer time={timeUntilLottery} />}
            <PrizePodium prizes={mainPrizes} />
          </View>
        </View>
      </SafeAreaView>

      <BottomWindowWithGesture
        visiblePart={renderContent()}
        maxHeight={0.85}
        minHeight={bottomWindowMinHeight}
        withVisiblePartScroll
        headerElement={
          <GroupedButtons
            style={styles.bottomWindowHeader}
            width={230}
            firstButtonText={'Prizes'}
            secondButtonText={'History'}
            isFirstButtonSelected={isPrizeSelected}
            setIsFirstButtonSelected={setIsPrizeSelected}
          />
        }
        headerWrapperStyle={styles.bottomWindowHeaderWrapper}
        containerStyle={styles.bottomWindowContainer}
      />

      <PrizesSlider
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedItemIndex={otherPrizes.findIndex(item => item.id === selectedPrize?.id)}
        listItem={otherPrizes}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 12,
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
  },
  bottomWindowContainer: {
    zIndex: 2,
  },
  renderContainer: {
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  itemWrapper: {
    flexBasis: '48%',
    marginBottom: 10,
  },
  podiumContainer: {
    flex: 1,
  },
  bottomWindowHeader: {
    alignSelf: 'center',
  },
  bottomWindowHeaderWrapper: {
    paddingTop: 10,
  },
});

export default Lottery;
