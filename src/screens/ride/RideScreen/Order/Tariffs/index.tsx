import { ReactNode, useCallback, useEffect, useState } from 'react';
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

//TODO: rewrite all tariffs files, current solution is not flexible
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { setEstimatedPrice, setTripTariff } from '../../../../../core/ride/redux/offer';
import { groupedTariffsSelector } from '../../../../../core/ride/redux/offer/selectors';
import { SelectedTariff, TariffCategory, TariffsType } from '../../../../../core/ride/redux/offer/types';
import { setOrderStatus } from '../../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../../core/ride/redux/order/types';
import TariffBar from './TariffBar';
import TariffGroup from './TariffGroup';
import { TariffsProps } from './types';

const Tariffs = ({ setIsAddressSelectVisible }: TariffsProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const groupedTariffs = useSelector(groupedTariffsSelector);

  const [selectedTariffGroup, setSelectedTariffGroup] = useState<TariffCategory | null>(groupedTariffs.economy ?? null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  const [selectedPriceIdx, setSelectedPriceIdx] = useState<number | null>(null);
  const [tariff, setTariff] = useState<SelectedTariff | null>(null);
  const [windowIsOpened, setWindowIsOpened] = useState(false);

  const isAvailableSelectedTariffGroup = Boolean(selectedTariffGroup?.tariffs);

  const computedStyles = StyleSheet.create({
    confirmText: {
      color: isAvailableSelectedTariffGroup ? colors.textPrimaryColor : colors.textQuadraticColor,
    },
  });

  useEffect(() => {
    let foundAvailableTariffGroup = null;
    Object.entries(groupedTariffs).forEach(([_, value]) => {
      if (value) {
        foundAvailableTariffGroup = value;
      }

      foundAvailableTariffGroup = null;
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
    setIsAddressSelectVisible(true);
  };

  const resetTariffPrice = useCallback(
    //TODO: add logic for currency
    (foundAvailableTariffIdx: number) => {
      if (selectedTariffGroup && selectedTariffGroup.tariffs) {
        const selectedTariffPlans = selectedTariffGroup.tariffs[foundAvailableTariffIdx].matching;
        if (selectedTariffPlans.length >= 2) {
          setSelectedPriceIdx(1);
          dispatch(setEstimatedPrice({ value: selectedTariffPlans[1].cost, currencyCode: 'UAH' }));
        } else if (selectedTariffPlans.length === 1) {
          setSelectedPriceIdx(0);
          dispatch(setEstimatedPrice({ value: selectedTariffPlans[0].cost, currencyCode: 'UAH' }));
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
      const foundAvailableTariffIdx = selectedTariffGroup?.tariffs?.findIndex(el => el !== undefined);

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

  const renderTariffsCategories = (): ReactNode[] => {
    const content: ReactNode[] = [];

    Object.entries(groupedTariffs).forEach(([key, value]) => {
      const isAvailableTariffGroup = value.tariffs !== undefined && value.tariffs.length > 0;
      let groupPrice = '';

      if (value.tariffs !== undefined && value.tariffs.length > 0) {
        groupPrice = (
          value.tariffs?.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.matching.reduce((acc, el) => acc + (el.cost ?? 0), 0),
            0,
          ) / value.tariffs.length
        ).toString();
      }
      content.push(
        <TariffGroup
          key={`tariff_group_${key}`}
          price={groupPrice}
          title={key as TariffsType}
          onPress={() => setSelectedTariffGroup(value)}
          isSelected={value.groupName === selectedTariffGroup?.groupName}
          isAvailableTariffGroup={isAvailableTariffGroup}
        />,
      );
    });

    return content;
  };

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
                  isAvailableTariff={true} //TODO: rewrite avaliability of tariff
                  windowIsOpened={windowIsOpened}
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
      setIsOpened={setWindowIsOpened}
      minHeight={0.6}
      alerts={
        <Button onPress={onBackPress} mode={CircleButtonModes.Mode2} shape={ButtonShapes.Circle} withBorder={false}>
          <ArrowIcon style={styles.backIcon} />
        </Button>
      }
      visiblePartStyle={styles.visiblePartStyle}
      visiblePart={content}
    />
  );
};

const styles = StyleSheet.create({
  visiblePartStyle: {
    flexShrink: 1,
    marginTop: 20,
    paddingBottom: 0,
  },
  backIcon: {
    transform: [{ rotate: '180deg' }],
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
