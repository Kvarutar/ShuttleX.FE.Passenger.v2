import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  GroupedButtons,
  LoadingSpinner,
  LoadingSpinnerIconModes,
  minToMilSec,
  SafeAreaView,
  sizes,
  useTheme,
} from 'shuttlex-integration';

import { clearPrizes } from '../../../core/lottery/redux';
import {
  isPrizesLoadingSelector,
  lotteryIdSelector,
  lotteryPrizesSelector,
  lotteryStartTimeSelector,
  lotteryStateSelector,
} from '../../../core/lottery/redux/selectors';
import { getCurrentLottery, getCurrentPrizes } from '../../../core/lottery/redux/thunks';
import { Prize } from '../../../core/lottery/redux/types';
import { useAppDispatch } from '../../../core/redux/hooks';
import CountdownTimer from './CountDownTimer';
import PrizeCard from './PrizeCard';
import PrizePodium from './PrizePodium';
import { prizesData } from './prizesData';
import PrizesSlider from './PrizesSlider';
import PrizeWithWinnerBar from './PrizeWithWinnerBar';
import { LotteryProps } from './types';

const windowHeight = Dimensions.get('window').height;

const Lottery = ({ triggerConfetti }: LotteryProps): JSX.Element => {
  const { colors } = useTheme();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef<boolean>(false);
  const dispatch = useAppDispatch();

  const timeUntilLottery = useSelector(lotteryStartTimeSelector);
  const lotteryState = useSelector(lotteryStateSelector);
  const lotteryId = useSelector(lotteryIdSelector);
  const lotteryPrizes = useSelector(lotteryPrizesSelector);
  const isPrizesLoading = useSelector(isPrizesLoadingSelector);

  const [isPrizeSelected, setIsPrizeSelected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [allWinners, setAllWinners] = useState<Prize[]>([]);

  const contentAnimatedHeight = useSharedValue(0);
  const podiumAnimatedHeight = useSharedValue(0);
  const bottomWindowMinHeight = useSharedValue(0);

  const { mainPrizes, otherPrizes } = useMemo(() => {
    return lotteryPrizes.reduce<{ mainPrizes: Prize[]; otherPrizes: Prize[] }>(
      (acc, prize) => {
        if (prize.index >= 0 && prize.index <= 2) {
          acc.mainPrizes.push(prize);
        } else {
          acc.otherPrizes.push(prize);
        }
        return acc;
      },
      { mainPrizes: [], otherPrizes: [] },
    );
  }, [lotteryPrizes]);

  useEffect(() => {
    if (lotteryState === 'CurrentUpcoming' && lotteryPrizes.length === 0) {
      dispatch(getCurrentPrizes());
    }

    if (lotteryState === 'CurrentActive') {
      if (allWinners.find(prize => prize.index === 0)) {
        setTimeout(() => {
          triggerConfetti();
        }, 1500);
        intervalRef.current && clearInterval(intervalRef.current);
      } else {
        intervalRef.current = setInterval(() => {
          triggerConfetti();
          dispatch(getCurrentPrizes());
        }, 10000);
      }
    }

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [allWinners, dispatch, lotteryPrizes.length, lotteryState, triggerConfetti]);

  useEffect(() => {
    setAllWinners(lotteryPrizes.filter(prize => prize.winnerId !== null));
  }, [lotteryPrizes]);

  useEffect(() => {
    let currentLotteryInterval: NodeJS.Timeout | undefined;

    if (lotteryState === 'CurrentActive') {
      currentLotteryInterval = setInterval(() => {
        dispatch(getCurrentLottery());
      }, minToMilSec(15));
    }

    return () => clearInterval(currentLotteryInterval);
  }, [dispatch, lotteryState]);

  useEffect(() => {
    //Skip first render
    if (!isFirstRender.current) {
      isFirstRender.current = true;
      return;
    }

    dispatch(clearPrizes());
  }, [dispatch, lotteryId]);

  const handleSurprisesPress = useCallback((prize: Prize) => {
    setSelectedPrize(prize);
    setModalVisible(true);
  }, []);

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    renderContainer: {
      flexDirection: lotteryState === 'CurrentActive' ? 'column' : 'row',
      justifyContent: lotteryState === 'CurrentActive' ? undefined : 'space-between',
    },
  });

  const renderContent = () => (
    <>
      <View style={[styles.renderContainer, computedStyles.renderContainer]}>
        {isPrizeSelected ? (
          otherPrizes.map(item => {
            const isWinner = allWinners.some(prize => prize.index === item.index);
            return lotteryState === 'CurrentActive' ? (
              isWinner && (
                <PrizeWithWinnerBar
                  key={item.prizes[0].prizeId}
                  prizeImage={prizesData[item.prizes[0].feKey].image}
                  prizeTitle={prizesData[item.prizes[0].feKey].name}
                  prizeId={item.prizes[0].prizeId}
                  winnerId={item.winnerId}
                  ticketCode={item.ticketNumber}
                  winnerName={item.winnerFirstName}
                  index={item.index + 1}
                />
              )
            ) : (
              <View key={item.prizes[0].prizeId} style={styles.itemWrapper}>
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

  if (isPrizesLoading && lotteryState === 'CurrentUpcoming') {
    return (
      <SafeAreaView>
        <LoadingSpinner iconMode={LoadingSpinnerIconModes.Large} startColor={colors.backgroundPrimaryColor} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView>
        <View style={styles.podiumContainer} onLayout={onContentPartLayout}>
          <View onLayout={onPodiumPartLayout}>
            {lotteryState === 'CurrentUpcoming' && <CountdownTimer startDate={new Date(timeUntilLottery)} />}
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
        selectedItemIndex={otherPrizes.findIndex(item => item.prizes[0].prizeId === selectedPrize?.prizes[0].prizeId)}
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
  prizesErrorText: {
    alignSelf: 'center',
  },
});

export default Lottery;
