import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BaggageIcon, Bar, ProfileIcon, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';

import PlanButton, { planPriceCounting } from '../../PlanButton/PlanButton';
import { TariffBarProps } from './types';

const TariffBar = ({
  isPlanSelected,
  selectedPrice,
  setSelectedPrice,
  onPress,
  tariff,
  info,
  plans,
  windowIsOpened,
  isAvailableTariff,
}: TariffBarProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const tariffsCarData = useTariffsIcons();

  const TariffImage = tariffsCarData[tariff].icon;
  const tariffTitle = tariffsCarData[tariff].text;
  const availablePlans = plans.filter(item => item.DurationSec !== null);
  const defaultPlanIndex = availablePlans.length > 1 ? 1 : 0;

  const computedStyles = StyleSheet.create({
    capacityColor: {
      color: colors.iconSecondaryColor,
    },
    separateCircle: {
      backgroundColor: colors.iconSecondaryColor,
    },
    container: {
      borderColor: isPlanSelected ? colors.borderColor : 'transparent',
      opacity: isAvailableTariff ? 1 : 0.3,
    },
    price: {
      color: colors.textSecondaryColor,
    },
    isNotSelectedPrice: {
      right: windowIsOpened ? 8 : 0,
    },
    tariffContainer: {
      flexDirection: windowIsOpened ? 'column' : 'row',
      alignItems: windowIsOpened ? 'baseline' : 'center',
      paddingHorizontal: windowIsOpened ? 8 : 0,
    },
    imageContainer: {
      flex: windowIsOpened ? 1 : 0,
      width: windowIsOpened ? '100%' : '35%',
      alignItems: 'center',
    },
    image: {
      flex: windowIsOpened ? 1 : 0,
      width: windowIsOpened ? '90%' : '100%',
      resizeMode: 'contain',
    },
  });

  const animatedButtonWrapper = useAnimatedStyle(() => {
    return {
      height: withTiming(isPlanSelected ? 76 : 0, { duration: 200 }),
    };
  });

  const animatedTariffContainer = useAnimatedStyle(() => {
    return {
      height: withTiming(windowIsOpened ? 200 : 52, { duration: 300 }),
    };
  });

  const formatTime = (time: number) => {
    const totalMinutes = Math.floor(time / 60);

    return `${t('ride_Ride_Tariffs_minutes', { count: totalMinutes })}`;
  };

  const capacityBlock = (
    <View style={styles.capacityContainer}>
      {availablePlans.length === 1 && (
        <>
          <Text style={[styles.capacityText, computedStyles.capacityColor]}>
            {formatTime(Number(availablePlans[defaultPlanIndex].DurationSec))}
          </Text>
          <View style={[styles.separateCircle, computedStyles.separateCircle]} />
        </>
      )}
      <ProfileIcon />
      <Text style={[styles.capacityText, computedStyles.capacityColor]}>1-{info.capacity}</Text>
      <View style={[styles.separateCircle, computedStyles.separateCircle]} />
      <BaggageIcon />
      <Text style={[styles.capacityText, computedStyles.capacityColor]}>{info.baggage}</Text>
    </View>
  );

  const tariffPrice = () => {
    if (isAvailableTariff) {
      if (!isPlanSelected || availablePlans.length === 1) {
        return `$${planPriceCounting(Number(availablePlans[defaultPlanIndex].DurationSec), availablePlans[defaultPlanIndex].AlgorythmType)}`;
      }
    } else {
      return t('ride_Ride_TariffBar_notAvailable');
    }
  };

  return (
    <Bar
      style={[styles.container, computedStyles.container]}
      onPress={event => {
        if (isAvailableTariff) {
          onPress(event);
        }
      }}
    >
      <Animated.View style={[styles.tariffContainer, computedStyles.tariffContainer, animatedTariffContainer]}>
        {windowIsOpened && <Text style={styles.title}>{tariffTitle}</Text>}
        <View style={computedStyles.imageContainer}>
          <TariffImage style={computedStyles.image} />
        </View>
        {windowIsOpened ? (
          capacityBlock
        ) : (
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{tariffTitle}</Text>
            {capacityBlock}
          </View>
        )}
        <Text
          style={[styles.isNotSelectedPrice, computedStyles.isNotSelectedPrice, styles.price, computedStyles.price]}
        >
          {tariffPrice()}
        </Text>
      </Animated.View>
      {availablePlans.length !== 1 && (
        <Animated.View style={animatedButtonWrapper}>
          <View style={styles.buttonContainer}>
            {availablePlans.map((plan, index) => (
              <PlanButton
                key={index}
                onPress={() => setSelectedPrice(index)}
                isSelected={selectedPrice === index}
                plan={plan}
              />
            ))}
          </View>
        </Animated.View>
      )}
    </Bar>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 5,
    paddingTop: 18,
  },
  price: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },
  tariffContainer: {
    flex: 1,
  },
  infoContainer: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginLeft: 28,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  title: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capacityText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
  },
  separateCircle: {
    width: 4,
    height: 4,
    borderRadius: 100,
  },
  isNotSelectedPrice: {
    position: 'absolute',
    bottom: 0,
  },
  planButton: {
    marginTop: 20,
  },
});

export default TariffBar;
