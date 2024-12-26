import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  GroupedButtons,
  LoadingSpinner,
  LoadingSpinnerIconModes,
  minToMilSec,
  Nullable,
  SafeAreaView,
  secToMilSec,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { clearPrizes, setLotterySelectedMode } from '../../../core/lottery/redux';
import {
  isPreviousPrizesLoadingSelector,
  isPrizesLoadingSelector,
  lotteryIdSelector,
  lotteryPreviousPrizesSelector,
  lotteryPrizesSelector,
  lotteryStartTimeSelector,
  lotteryStateSelector,
  previousLotteryIdSelector,
} from '../../../core/lottery/redux/selectors';
import {
  getCurrentPrizes,
  getCurrentUpcomingLottery,
  getPreviousLottery,
  getPreviousPrizes,
} from '../../../core/lottery/redux/thunks';
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
  const { t } = useTranslation();
  const intervalRef = useRef<Nullable<NodeJS.Timeout>>(null);
  const isFirstRender = useRef<boolean>(false);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const timeUntilLottery = useSelector(lotteryStartTimeSelector);
  const lotteryState = useSelector(lotteryStateSelector);
  const lotteryId = useSelector(lotteryIdSelector);
  const lotteryPrizes = useSelector(lotteryPrizesSelector);
  const isPrizesLoading = useSelector(isPrizesLoadingSelector);

  const previousLotteryId = useSelector(previousLotteryIdSelector);
  const lotteryPreviousPrizes = useSelector(lotteryPreviousPrizesSelector);
  const isPreviousPrizesLoading = useSelector(isPreviousPrizesLoadingSelector);

  const [isPrizeSelected, setIsPrizeSelected] = useState(true);
  const [isBottomWindowOpen, setIsBottomWindowOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [allWinners, setAllWinners] = useState<Prize[]>([]);

  const contentAnimatedHeight = useSharedValue(0);
  const podiumAnimatedHeight = useSharedValue(0);
  const bottomWindowMinHeight = useSharedValue(0);
  const safeAreaViewPaddingVertical =
    insets.bottom && Platform.OS === 'ios' ? sizes.paddingVertical : sizes.paddingVertical / 2;

  const isWinnersExist = allWinners.some(prize => prize.winnerId !== null);

  const { mainPrizes, otherPrizes, sortedPrizes } = useMemo(() => {
    const prizes = isPrizeSelected ? lotteryPrizes : lotteryPreviousPrizes;
    const sortedPrizes = [...prizes].sort((a, b) => a.index - b.index);

    const { mainPrizes, otherPrizes } = sortedPrizes.reduce<{ mainPrizes: Prize[]; otherPrizes: Prize[] }>(
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

    return { mainPrizes, otherPrizes, sortedPrizes };
  }, [isPrizeSelected, lotteryPreviousPrizes, lotteryPrizes]);

  useEffect(() => {
    if (lotteryState === 'CurrentUpcoming' && lotteryPrizes.length === 0) {
      dispatch(getCurrentPrizes());
    }

    if (lotteryState === 'CurrentActive') {
      if (lotteryPrizes.length === 0) {
        dispatch(getCurrentPrizes());
      }

      if (allWinners.find(prize => prize.index === 0)) {
        intervalRef.current && clearInterval(intervalRef.current);
      } else if (intervalRef.current === null) {
        intervalRef.current = setInterval(() => {
          dispatch(getCurrentPrizes());
        }, secToMilSec(30));
      }
    }
  }, [allWinners, dispatch, lotteryPrizes.length, lotteryState]);

  useEffect(() => {
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      triggerConfetti();
    }, 1000);
  }, [triggerConfetti, allWinners.length, lotteryState]);

  useEffect(() => {
    setAllWinners(lotteryPrizes.filter(prize => prize.winnerId !== null));
  }, [lotteryPrizes]);

  useEffect(() => {
    const isLastWinnerExist = allWinners.some(prize => prize.index === 0);

    if (isLastWinnerExist) {
      setTimeout(() => {
        dispatch(getCurrentUpcomingLottery());
        dispatch(getPreviousLottery());
      }, minToMilSec(6));
    }
  }, [allWinners, dispatch]);

  useEffect(() => {
    //Skip first render
    if (!isFirstRender.current) {
      isFirstRender.current = true;
      return;
    }

    if (lotteryId) {
      dispatch(clearPrizes());
    }
  }, [dispatch, lotteryId]);

  const handleSurprisesPress = useCallback((prize: Prize) => {
    setSelectedPrize(prize);
    setModalVisible(true);
  }, []);

  const onGroupedButtonsPress = (state: boolean) => {
    setIsPrizeSelected(state);
    dispatch(setLotterySelectedMode(state ? 'current' : 'history'));
    if (lotteryPreviousPrizes.length === 0) {
      dispatch(getPreviousPrizes());
    }
  };

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textPrimaryColor,
    },
    renderContainer: {
      flexDirection: lotteryState === 'CurrentActive' ? 'column' : 'row',
      justifyContent: lotteryState === 'CurrentActive' ? undefined : 'space-between',
    },
    noWinnersExistText: {
      color: colors.textTitleColor,
    },
    visiblePartStyle: {
      paddingBottom: isBottomWindowOpen ? 10 : 70,
    },
  });

  const renderContent = () => (
    <View style={[styles.renderContainer, computedStyles.renderContainer]}>
      {isPrizeSelected ? (
        !isWinnersExist && lotteryState === 'CurrentActive' ? (
          <Text style={[styles.noWinnersExistText, computedStyles.noWinnersExistText]}>
            {t('raffle_Lottery_raffleBegins')}
          </Text>
        ) : (
          otherPrizes.map(item => {
            const isWinner = allWinners.some(prize => prize.index === item.index);
            const feKey = item.prizes[0].feKey;

            return lotteryState === 'CurrentActive' ? (
              isWinner && (
                <PrizeWithWinnerBar
                  key={item.prizes[0].prizeId}
                  prizeImage={prizesData[feKey].image}
                  prizeTitle={t(prizesData[feKey].name)}
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
        )
      ) : (
        otherPrizes.map(item => (
          <PrizeWithWinnerBar
            key={item.prizes[0].prizeId}
            prizeImage={prizesData[item.prizes[0].feKey].image}
            prizeTitle={t(prizesData[item.prizes[0].feKey].name)}
            prizeId={item.prizes[0].prizeId}
            winnerId={item.winnerId}
            ticketCode={item.ticketNumber}
            winnerName={item.winnerFirstName}
            index={item.index + 1}
          />
        ))
      )}
    </View>
  );

  const onContentPartLayout = (e: LayoutChangeEvent) => {
    contentAnimatedHeight.value = e.nativeEvent.layout.height;
  };

  const onPodiumPartLayout = (e: LayoutChangeEvent) => {
    podiumAnimatedHeight.value = e.nativeEvent.layout.height;
  };

  useDerivedValue(() => {
    bottomWindowMinHeight.value =
      (contentAnimatedHeight.value - podiumAnimatedHeight.value + safeAreaViewPaddingVertical) / windowHeight;
  });

  if ((isPrizesLoading && lotteryState === 'CurrentUpcoming') || isPreviousPrizesLoading) {
    return (
      <SafeAreaView>
        <LoadingSpinner iconMode={LoadingSpinnerIconModes.Large} startColor={colors.backgroundPrimaryColor} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView containerStyle={styles.safeAreaViewContainerStyle}>
        <View style={styles.podiumContainer} onLayout={onContentPartLayout}>
          <View onLayout={onPodiumPartLayout}>
            {lotteryState === 'CurrentUpcoming' && timeUntilLottery && isPrizeSelected && (
              <CountdownTimer startDate={new Date(timeUntilLottery)} />
            )}
            <PrizePodium prizes={mainPrizes} handleSurprisesPress={handleSurprisesPress} />
          </View>
        </View>
      </SafeAreaView>

      <BottomWindowWithGesture
        visiblePart={renderContent()}
        maxHeight={0.85}
        minHeight={bottomWindowMinHeight}
        withVisiblePartScroll
        setIsOpened={setIsBottomWindowOpen}
        headerElement={
          previousLotteryId && (
            <GroupedButtons
              style={styles.bottomWindowHeader}
              width={230}
              firstButtonText={t('raffle_Lottery_prizesButton')}
              secondButtonText={t('raffle_Lottery_historyButton')}
              isFirstButtonSelected={isPrizeSelected}
              setIsFirstButtonSelected={onGroupedButtonsPress}
            />
          )
        }
        containerStyle={styles.bottomWindowContainer}
        visiblePartStyle={[styles.visiblePartStyle, previousLotteryId ? computedStyles.visiblePartStyle : {}]}
      />

      <PrizesSlider
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedItemIndex={sortedPrizes.findIndex(item => item.prizes[0].prizeId === selectedPrize?.prizes[0].prizeId)}
        listItem={sortedPrizes}
      />
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainerStyle: {
    paddingTop: 0,
  },
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
  visiblePartStyle: {
    paddingTop: 18,
    marginBottom: 10,
  },
  renderContainer: {
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
    marginTop: 8,
  },
  prizesErrorText: {
    alignSelf: 'center',
  },
  noWinnersExistText: {
    width: '100%',
    marginTop: 16,
    fontSize: 22,
    textAlign: 'center',
  },
});

export default Lottery;
