import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ArrowIcon,
  BarModes,
  BottomWindowWithGesture,
  Button,
  ButtonShadows,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  SquareButtonModes,
  TariffType,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { setOrderStatus, setTripTariff } from '../../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../../core/ride/redux/order/types';
import { TariffGroupType, TariffsProps } from './props';
import TariffBar from './TariffBar';
import TariffGroup from './TariffGroup';

const testTariffsGroup: TariffGroupType[] = [
  {
    name: 'Economy',
    tariffs: [
      {
        tariff: 'Basic',
        info: {
          capacity: '6',
          baggage: '3',
          isAvailable: true,
        },
        plans: [
          {
            Tariffid: 0,
            AlgorythmType: 'Eager Fast',
            DurationSec: 100,
          },
          {
            Tariffid: 1,
            AlgorythmType: 'Hungarian',
            DurationSec: 200,
          },
          {
            Tariffid: 2,
            AlgorythmType: 'Eager Cheap',
            DurationSec: 300,
          },
        ],
      },
      {
        tariff: 'BasicXL',
        info: {
          capacity: '6',
          baggage: '3',
          isAvailable: true,
        },
        plans: [
          {
            Tariffid: 0,
            AlgorythmType: 'Eager Fast',
            DurationSec: 100,
          },
          {
            Tariffid: 1,
            AlgorythmType: 'Hungarian',
            DurationSec: 200,
          },
          {
            Tariffid: 2,
            AlgorythmType: 'Eager Cheap',
            DurationSec: null,
          },
        ],
      },
      {
        tariff: 'Eco',
        info: {
          capacity: '6',
          baggage: '3',
          isAvailable: true,
        },
        plans: [
          {
            Tariffid: 0,
            AlgorythmType: 'Eager Fast',
            DurationSec: null,
          },
          {
            Tariffid: 1,
            AlgorythmType: 'Hungarian',
            DurationSec: null,
          },
          {
            Tariffid: 2,
            AlgorythmType: 'Eager Cheap',
            DurationSec: 300,
          },
        ],
      },
    ],
  },
  {
    name: 'Exclusive',
    tariffs: [
      {
        tariff: 'ComfortPlus',
        info: {
          capacity: '6',
          baggage: '3',
          isAvailable: true,
        },
        plans: [
          {
            Tariffid: 0,
            AlgorythmType: 'Eager Fast',
            DurationSec: 100,
          },
          {
            Tariffid: 1,
            AlgorythmType: 'Hungarian',
            DurationSec: null,
          },
          {
            Tariffid: 2,
            AlgorythmType: 'Eager Cheap',
            DurationSec: 300,
          },
        ],
      },
    ],
  },
  {
    name: 'Business',
    tariffs: [
      {
        tariff: 'Business',
        info: {
          capacity: '6',
          baggage: '3',
          isAvailable: false,
        },
        plans: [
          {
            Tariffid: 0,
            AlgorythmType: 'Eager Fast',
            DurationSec: null,
          },
          {
            Tariffid: 1,
            AlgorythmType: 'Hungarian',
            DurationSec: 200,
          },
          {
            Tariffid: 2,
            AlgorythmType: 'Eager Cheap',
            DurationSec: null,
          },
        ],
      },
    ],
  },
];

const Tariffs = ({ setIsAddressSelectVisible }: TariffsProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [selectedTariffGroup, setSelectedTariffGroup] = useState<TariffGroupType | null>(
    testTariffsGroup.find(item => item.name === 'Economy') ?? null,
  );
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  const [selectedPriceIdx, setSelectedPriceIdx] = useState<number | null>(null);
  const [tariff, setTariff] = useState<TariffType>('Basic');
  const [windowIsOpened, setWindowIsOpened] = useState(false);

  const isAvailableSelectedTariffGroup = selectedTariffGroup?.tariffs.some(trf => trf.info.isAvailable);

  const computedStyles = StyleSheet.create({
    confirmButton: {
      bottom: windowIsOpened ? 38 : 70,
    },
    scrollView: {
      marginBottom: windowIsOpened ? 20 : 50,
    },
    confirmText: {
      color: isAvailableSelectedTariffGroup ? colors.textPrimaryColor : colors.textQuadraticColor,
    },
  });

  useEffect(() => {
    const foundAvailableTariffGroup = testTariffsGroup.find(trfGroup =>
      trfGroup.tariffs.some(trf => trf.info.isAvailable),
    );
    if (foundAvailableTariffGroup) {
      setSelectedTariffGroup(foundAvailableTariffGroup);
    }
  }, []);

  const resetTariffPrice = useCallback(
    (foundAvailableTariffIdx: number) => {
      if (selectedTariffGroup) {
        const selectedTariffPlans = selectedTariffGroup.tariffs[foundAvailableTariffIdx].plans;
        if (selectedTariffPlans.length >= 2) {
          setSelectedPriceIdx(1);
        } else if (selectedTariffPlans.length === 1) {
          setSelectedPriceIdx(0);
        } else {
          setSelectedPriceIdx(null);
        }
      }
    },
    [selectedTariffGroup],
  );

  useEffect(() => {
    if (selectedTariffGroup) {
      const foundAvailableTariffIdx = selectedTariffGroup?.tariffs.findIndex(trf => trf.info.isAvailable);
      if (foundAvailableTariffIdx !== -1) {
        setSelectedPlanIndex(foundAvailableTariffIdx);
        resetTariffPrice(foundAvailableTariffIdx);
      }
    }
    return () => {
      setSelectedPlanIndex(null);
    };
  }, [selectedTariffGroup, resetTariffPrice]);

  useEffect(() => {
    if (selectedPlanIndex && selectedTariffGroup?.tariffs[selectedPlanIndex]) {
      setTariff(selectedTariffGroup?.tariffs[selectedPlanIndex].tariff);
      resetTariffPrice(selectedPlanIndex);
    }
  }, [selectedPlanIndex, selectedTariffGroup, resetTariffPrice]);

  const onTariffSelect = () => {
    dispatch(setTripTariff(tariff));
    dispatch(setOrderStatus(OrderStatus.Payment));
  };

  const onBackPress = () => {
    dispatch(setOrderStatus(OrderStatus.StartRide));
    setIsAddressSelectVisible(true);
  };

  const content = (
    <>
      <View style={styles.container}>
        <View style={styles.tariffsContainer}>
          {testTariffsGroup.map(group => (
            <TariffGroup
              key={`tariff_group_${group.name}`}
              price="12"
              title={group.name}
              onPress={() => setSelectedTariffGroup(group)}
              mode={group.name === selectedTariffGroup?.name ? BarModes.Active : BarModes.Disabled}
              isAvailableTariffGroup={group.tariffs.some(trf => trf.info.isAvailable)}
            />
          ))}
        </View>
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={[styles.scrollView, computedStyles.scrollView]}
        >
          <View>
            {selectedTariffGroup?.tariffs.map((tariffBar, index) => (
              <TariffBar
                key={`tariff_${index}`}
                onPress={() => setSelectedPlanIndex(index)}
                isPlanSelected={selectedPlanIndex === index}
                selectedPrice={selectedPriceIdx}
                setSelectedPrice={setSelectedPriceIdx}
                tariff={tariffBar.tariff}
                info={tariffBar.info}
                plans={tariffBar.plans}
                isAvailableTariff={tariffBar.info.isAvailable}
                windowIsOpened={windowIsOpened}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <Button
        containerStyle={[styles.confirmButton, computedStyles.confirmButton]}
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
      maxHeight={windowIsOpened ? 0.93 : 0.6}
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
  },
  backIcon: {
    transform: [{ rotate: '180deg' }],
  },
  container: {
    marginHorizontal: -8,
    height: '100%',
    position: 'relative',
  },
  tariffsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  scrollView: {
    flex: 0,
    flexShrink: 1,
    marginTop: 8,
  },
  confirmButton: {
    position: 'absolute',
    alignSelf: 'center',
  },
  confirmText: {
    fontFamily: 'Inter Bold',
    fontSize: 17,
  },
});

export default Tariffs;
