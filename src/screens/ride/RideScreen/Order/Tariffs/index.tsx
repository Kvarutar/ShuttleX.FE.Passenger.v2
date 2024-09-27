import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ArrowIcon,
  BarModes,
  BottomWindowWithGesture,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  TariffType,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { setOrderStatus, setTripTariff } from '../../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../../core/ride/redux/order/types';
import { TariffBarType, TariffsProps } from './props';
import TariffBar from './TariffBar';
import TariffGroup from './TariffGroup';

const testTariffsGroup: { name: string; tariffs: TariffBarType[] }[] = [
  {
    name: 'Economy',
    tariffs: [
      {
        tariff: 'Basic',
        info: {
          capacity: '6',
          baggage: '3',
        },
        plans: [
          {
            time: '2',
            price: '12',
          },
          {
            time: '4',
            price: '10',
          },
          {
            time: '10',
            price: '2',
          },
        ],
      },
      {
        tariff: 'BasicXL',
        info: {
          capacity: '6',
          baggage: '3',
        },
        plans: [
          {
            time: '2',
            price: '12',
          },
          {
            time: '4',
            price: '10',
          },
        ],
      },
      {
        tariff: 'Eco',
        info: {
          capacity: '6',
          baggage: '3',
        },
        plans: [
          {
            time: '5',
            price: '12',
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
        },
        plans: [
          {
            time: '2',
            price: '12',
          },
          {
            time: '4',
            price: '10',
          },
          {
            time: '10',
            price: '2',
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
        },
        plans: [
          {
            time: '2',
            price: '12',
          },
          {
            time: '4',
            price: '10',
          },
        ],
      },
    ],
  },
];

const Tariffs = ({ setIsAddressSelectVisible }: TariffsProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [selectedTariffGroup, setSelectedTariffGroup] = useState('Economy');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [tariff, setTariff] = useState<TariffType>('Basic');
  const [windowIsOpened, setWindowIsOpened] = useState(false);

  const tariffGroup = testTariffsGroup.find(item => item.name === selectedTariffGroup);

  const computedStyles = StyleSheet.create({
    confirmButton: {
      bottom: windowIsOpened ? 38 : 70,
    },
    scrollView: {
      marginBottom: windowIsOpened ? 20 : 50,
    },
  });

  useEffect(() => {
    setSelectedPlanIndex(0);
  }, [selectedTariffGroup]);

  useEffect(() => {
    if (tariffGroup?.tariffs[selectedPlanIndex]) {
      setTariff(tariffGroup?.tariffs[selectedPlanIndex].tariff);
    }
  }, [selectedPlanIndex, selectedTariffGroup, tariffGroup?.tariffs]);

  const onTariffSelect = () => {
    dispatch(setTripTariff(tariff));
    dispatch(setOrderStatus(OrderStatus.Confirming));
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
              onPress={() => setSelectedTariffGroup(group.name)}
              mode={group.name === selectedTariffGroup ? BarModes.Active : BarModes.Disabled}
            />
          ))}
        </View>
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={[styles.scrollView, computedStyles.scrollView]}
        >
          <View>
            {tariffGroup?.tariffs?.map((tariffBar, index) => (
              <TariffBar
                key={`tariff_${index}`}
                onPress={() => setSelectedPlanIndex(index)}
                selectedGroup={selectedTariffGroup}
                selectedPlan={selectedPlanIndex === index}
                tariff={tariffBar.tariff}
                info={tariffBar.info}
                plans={tariffBar.plans}
                windowIsOpened={windowIsOpened}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <Button
        style={[styles.confirmButton, computedStyles.confirmButton]}
        shape={ButtonShapes.Circle}
        size={ButtonSizes.L}
        innerSpacing={8}
        onPress={onTariffSelect}
        text={t('ride_Ride_Tariffs_nextButton')}
        textStyle={styles.confirmText}
      />
    </>
  );

  return (
    <BottomWindowWithGesture
      setIsOpened={setWindowIsOpened}
      maxHeight={windowIsOpened ? 0.93 : 0.6}
      alerts={
        <Button
          onPress={onBackPress}
          mode={CircleButtonModes.Mode2}
          shape={ButtonShapes.Circle}
          circleSubContainerStyle={styles.backButton}
        >
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
  backButton: {
    borderWidth: 0,
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
