import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  ArrowIcon,
  BottomWindowWithGesture,
  Button,
  ButtonShadows,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  SquareButtonModes,
  useTheme,
} from 'shuttlex-integration';
import { CurrencyType } from 'shuttlex-integration/lib/typescript/src/utils/currency/types';

import { setActiveBottomWindowYCoordinate } from '../../../../../core/passenger/redux';
//TODO: rewrite all tariffs files, current solution is not flexible
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { setCurrentSelectedTariff, setEstimatedPrice, setTripTariff } from '../../../../../core/ride/redux/offer';
import {
  groupedTariffsSelector,
  minDurationTariffSelector,
  offerRoutesSelector,
} from '../../../../../core/ride/redux/offer/selectors';
import { getTariffsPrices } from '../../../../../core/ride/redux/offer/thunks';
import { SelectedTariff, TariffCategory, TariffsType } from '../../../../../core/ride/redux/offer/types';
import { setIsAddressSelectVisible, setOrderStatus } from '../../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../../core/ride/redux/order/types';
import MapCameraModeButton from '../../MapCameraModeButton';
import TariffBar from './TariffBar';
import TariffGroup from './TariffGroup';

const carsAnimationDelaysInMilSec = {
  tariffBar: 200,
  tariffGroup: 100,
};

const Tariffs = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const groupedTariffs = useSelector(groupedTariffsSelector);
  const minDurationTariff = useSelector(minDurationTariffSelector);
  const offerRoutes = useSelector(offerRoutesSelector);

  const [selectedTariffGroup, setSelectedTariffGroup] = useState<TariffCategory | null>(groupedTariffs.economy ?? null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  const [selectedPriceIdx, setSelectedPriceIdx] = useState<number | null>(null);
  const [tariff, setTariff] = useState<SelectedTariff | null>(null);
  const [windowIsOpened, setWindowIsOpened] = useState(false);

  const withAnimatedBigCars = useRef(true);

  const isAvailableSelectedTariffGroup = selectedTariffGroup?.tariffs?.some(trf => trf.cost !== null && trf.cost !== 0);
  // const isAvailableSelectedTariffGroup = selectedTariffGroup?.tariffs?.some(trf =>
  //   trf.matching.some(item => item.durationSec !== null && item.durationSec !== 0),
  // );
  const computedStyles = StyleSheet.create({
    confirmText: {
      color: isAvailableSelectedTariffGroup ? colors.textPrimaryColor : colors.textQuadraticColor,
    },
  });

  useEffect(() => {
    dispatch(setCurrentSelectedTariff(tariff));
  }, [dispatch, tariff]);

  useEffect(() => {
    if (offerRoutes) {
      dispatch(getTariffsPrices());
    }
  }, [offerRoutes, dispatch]);

  useEffect(() => {
    let foundAvailableTariffGroup = null;
    Object.entries(groupedTariffs).some(([_, value]) => {
      if (value) {
        foundAvailableTariffGroup = value;
        return true;
      }
    });

    if (foundAvailableTariffGroup) {
      setSelectedTariffGroup(foundAvailableTariffGroup);
    }
  }, [groupedTariffs]);

  const onTariffSelect = () => {
    if (tariff) {
      dispatch(setTripTariff(tariff));
      dispatch(setOrderStatus(OrderStatus.Payment));
    }
  };

  const onBackPress = () => {
    dispatch(setOrderStatus(OrderStatus.StartRide));
    dispatch(setIsAddressSelectVisible(true));
  };

  const resetTariffPrice = useCallback(
    //TODO: add logic for currency
    (foundAvailableTariffIdx: number) => {
      if (selectedTariffGroup && selectedTariffGroup.tariffs) {
        //TODO: dumb logic while backend don't have normal way for algorythms
        const selectedTariffPlans = selectedTariffGroup.tariffs[foundAvailableTariffIdx];
        // if (selectedTariffPlans.length >= 2) {
        //   setSelectedPriceIdx(1);
        //   dispatch(
        //     setEstimatedPrice({ value: selectedTariffPlans[1].cost, currencyCode: selectedTariffPlans[1].currency }),
        //   );
        // } else if (selectedTariffPlans.length === 1) {
        //   setSelectedPriceIdx(0);
        //   dispatch(
        //     setEstimatedPrice({ value: selectedTariffPlans[0].cost, currencyCode: selectedTariffPlans[0].currency }),
        //   );
        // } else {
        //   setSelectedPriceIdx(null);
        //   dispatch(setEstimatedPrice(null));
        // }

        if (selectedTariffPlans) {
          setSelectedPriceIdx(0);
          dispatch(
            setEstimatedPrice({ value: selectedTariffPlans.cost, currencyCode: selectedTariffPlans.currencyCode }),
          );
        } else {
          setSelectedPriceIdx(null);
          dispatch(setEstimatedPrice(null));
        }
      }
    },
    [selectedTariffGroup, dispatch],
  );

  useEffect(() => {
    if (selectedTariffGroup) {
      //TODO: dumb logic while backend don't have normal way for algorythms
      const foundAvailableTariffIdx = selectedTariffGroup?.tariffs?.findIndex(el => el?.cost !== null);

      if (foundAvailableTariffIdx !== undefined && foundAvailableTariffIdx !== -1) {
        setSelectedPlanIndex(foundAvailableTariffIdx);
        resetTariffPrice(foundAvailableTariffIdx);
      }
    }
    return () => {
      setSelectedPlanIndex(null);
    };
  }, [selectedTariffGroup, resetTariffPrice]);

  useEffect(() => {
    if (selectedPlanIndex !== null && selectedTariffGroup?.tariffs?.[selectedPlanIndex]) {
      setTariff(selectedTariffGroup?.tariffs[selectedPlanIndex]);
      resetTariffPrice(selectedPlanIndex);
    }
  }, [selectedPlanIndex, selectedTariffGroup, resetTariffPrice]);

  const renderTariffsCategories = useCallback((): ReactNode[] => {
    const content: ReactNode[] = [];

    Object.entries(groupedTariffs).forEach(([key, value]) => {
      let groupPrice = 0;
      let currencyCode: CurrencyType = 'UAH';

      // if (value.tariffs !== undefined && value.tariffs.length > 0) {
      //   const filteredTariffs = value.tariffs?.filter(trf =>
      //     trf.matching.some(el => el.durationSec !== null && el.durationSec !== 0),
      //   );

      //   groupPrice =
      //     filteredTariffs && filteredTariffs.length > 0
      //       ? filteredTariffs?.reduce(
      //           (accumulator, trf) =>
      //             accumulator +
      //             trf.matching.reduce(
      //               (acc, el) => acc + (el.durationSec !== null && el.durationSec !== 0 ? (el.cost ?? 0) : 0),
      //               0,
      //             ),
      //           0,
      //         ) / filteredTariffs?.length
      //       : 0;

      if (value.tariffs !== undefined && value.tariffs.length > 0) {
        const filteredTariffs = value.tariffs?.filter(trf => trf.cost !== null);

        groupPrice =
          filteredTariffs && filteredTariffs.length > 0
            ? filteredTariffs.reduce((accumulator, trf) => accumulator + (trf.cost ?? 0), 0) / filteredTariffs.length
            : 0;

        const isContainFastestTariff = filteredTariffs?.some(item => item.id === minDurationTariff?.id);

        currencyCode = value.tariffs[0].currencyCode as CurrencyType;

        //TODO: think about smarter key?
        content.push(
          <TariffGroup
            isContainFastestTariff={isContainFastestTariff}
            key={`tariff_group_${key}`}
            currencyCode={currencyCode}
            price={Math.round(groupPrice)}
            title={key as TariffsType}
            onPress={() => setSelectedTariffGroup(value)}
            isSelected={value.groupName === selectedTariffGroup?.groupName}
            carsAnimationDelayInMilSec={content.length * carsAnimationDelaysInMilSec.tariffGroup}
          />,
        );
      }
    });

    return content;
  }, [groupedTariffs, minDurationTariff?.id, selectedTariffGroup]);

  const content = (
    <>
      <View style={styles.container}>
        <View style={styles.tariffsContainer}>{renderTariffsCategories()}</View>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={styles.scrollViewWrapper}>
          <View style={styles.scrollViewContainer}>
            {selectedTariffGroup?.tariffs?.map((tariffBar, index) => (
              <Animated.View key={`${selectedTariffGroup?.groupName}_${index}`} entering={FadeIn} exiting={FadeOut}>
                <TariffBar
                  onPress={() => setSelectedPlanIndex(index)}
                  isPlanSelected={selectedPlanIndex === index}
                  selectedPrice={selectedPriceIdx}
                  setSelectedPrice={setSelectedPriceIdx}
                  tariff={tariffBar}
                  windowIsOpened={windowIsOpened}
                  carsAnimationDelayInMilSec={index * carsAnimationDelaysInMilSec.tariffBar}
                  withAnimatedBigCars={withAnimatedBigCars.current}
                />
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </View>
      <Button
        containerStyle={styles.confirmButton}
        withCircleModeBorder
        shadow={ButtonShadows.Strong}
        shape={ButtonShapes.Circle}
        size={ButtonSizes.L}
        innerSpacing={8}
        onPress={onTariffSelect}
        text={t('ride_Ride_Tariffs_nextButton')}
        textStyle={[styles.confirmText, computedStyles.confirmText]}
        mode={isAvailableSelectedTariffGroup ? SquareButtonModes.Mode1 : SquareButtonModes.Mode4}
        disabled={!isAvailableSelectedTariffGroup}
      />
    </>
  );

  return (
    <BottomWindowWithGesture
      onGestureUpdate={callback => dispatch(setActiveBottomWindowYCoordinate(callback.y))}
      setIsOpened={value => {
        setWindowIsOpened(value);
        if (withAnimatedBigCars.current) {
          withAnimatedBigCars.current = false;
        }
      }}
      minHeight={0.6}
      additionalTopContent={
        <View style={styles.additionalTopContent}>
          <Button onPress={onBackPress} mode={CircleButtonModes.Mode2} shape={ButtonShapes.Circle} withBorder={false}>
            <ArrowIcon style={styles.backIcon} />
          </Button>
          <MapCameraModeButton />
        </View>
      }
      visiblePartStyle={styles.visiblePartStyle}
      visiblePart={content}
    />
  );
};

const styles = StyleSheet.create({
  additionalTopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backIcon: {
    transform: [{ rotate: '180deg' }],
  },
  visiblePartStyle: {
    flexShrink: 1,
    marginTop: 20,
    paddingBottom: 0,
  },
  container: {
    marginHorizontal: -8,
    flexShrink: 1,
    height: '100%',
    position: 'relative',
  },
  tariffsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  scrollViewWrapper: {
    flex: 0,
    flexShrink: 1,
    marginTop: 8,
  },
  scrollViewContainer: {
    paddingBottom: 8,
  },
  confirmButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 38,
  },
  confirmText: {
    fontFamily: 'Inter Bold',
    fontSize: 17,
  },
});

export default Tariffs;
