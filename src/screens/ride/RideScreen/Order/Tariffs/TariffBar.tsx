import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  AnimatedCarImage,
  BaggageIcon,
  getCurrencySign,
  ProfileIcon,
  Skeleton,
  Text,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';
import { CurrencyType } from 'shuttlex-integration/lib/typescript/src/utils/currency/types';

import {
  isPhantomOfferLoadingSelector,
  isTariffsPricesLoadingSelector,
  minDurationTariffSelector,
} from '../../../../../core/ride/redux/offer/selectors';
import passengerColors from '../../../../../shared/colors/colors';
import PlanButton from '../../PlanButton/PlanButton';
import { TariffBarProps } from './types';

const animationDuration = 300;

//TODO: do skeleton while we don't have price and duration
const TariffBar = ({
  isPlanSelected,
  selectedPrice,
  setSelectedPrice,
  onPress,
  tariff,
  windowIsOpened,
  carsAnimationDelayInMilSec,
  withAnimatedBigCars,
}: TariffBarProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const tariffsCarData = useTariffsIcons();

  const isTariffsPricesLoading = useSelector(isTariffsPricesLoadingSelector);
  const isPhantomOfferLoading = useSelector(isPhantomOfferLoadingSelector);
  const minDurationTariff = useSelector(minDurationTariffSelector);

  const tariffTitle = tariffsCarData[tariff.name].text;
  const availablePlans = useMemo(
    () => (tariff.matching ? tariff.matching.filter(item => item.durationSec !== null) : []),
    [tariff],
  );
  const defaultPlanIndex = availablePlans.length > 1 ? 1 : 0;
  const showPriceAndTime = !isPlanSelected || availablePlans.length < 2;
  const isAvailableTariff = availablePlans[defaultPlanIndex]?.durationSec !== 0;

  const [withAnimatedSmallCar, setWithAnimatedSmallCar] = useState(true);

  useEffect(() => {
    if (windowIsOpened && withAnimatedSmallCar) {
      setWithAnimatedSmallCar(false);
    }
  }, [windowIsOpened, withAnimatedSmallCar]);

  const computedStyles = StyleSheet.create({
    capacityColor: {
      color: colors.iconSecondaryColor,
    },
    separateCircle: {
      backgroundColor: colors.iconSecondaryColor,
    },
    wrapper: {
      opacity: isAvailableTariff ? 1 : 0.4,
    },
    price: {
      color: colors.textSecondaryColor,
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
    timeContainer: {
      backgroundColor: minDurationTariff?.id === tariff.id ? colors.primaryColor : 'transparent',
    },
    timeText: {
      color: minDurationTariff?.id === tariff.id ? colors.textPrimaryColor : colors.iconSecondaryColor,
    },
  });

  const animatedStyles = {
    buttonWrapper: useAnimatedStyle(() => ({
      height: withTiming(isPlanSelected ? 76 : 0, { duration: animationDuration }),
    })),
    tariffContainer: useAnimatedStyle(() => ({
      height: withTiming(windowIsOpened ? 200 : 52, { duration: animationDuration }),
    })),
  };

  const animatedContainerStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPlanSelected ? colors.backgroundPrimaryColor : colors.backgroundSecondaryColor, {
      duration: animationDuration,
    }),
    borderColor: withTiming(isPlanSelected ? colors.borderColor : 'transparent', {
      duration: animationDuration,
    }),
  }));

  const formatTime = (time: number) => {
    const totalMinutes = Math.floor(time / 60);

    return `${t('ride_Ride_Tariffs_minutes', { count: totalMinutes })}`;
  };

  const formatCapacityAmount = (value: number) => {
    if (value === 1) {
      return '1';
    }
    return `1-${value}`;
  };

  const capacityBlock = (
    <View style={styles.capacityContainer}>
      <ProfileIcon />
      <Text style={[styles.capacityText, computedStyles.capacityColor]}>
        {formatCapacityAmount(Number(tariff.maxSeatsCount))}
      </Text>
      {(windowIsOpened || isAvailableTariff) && (
        <>
          <View style={[styles.separateCircle, computedStyles.separateCircle]} />
          <BaggageIcon />
          <Text style={[styles.capacityText, computedStyles.capacityColor]}>{tariff.maxLuggagesCount}</Text>
        </>
      )}
    </View>
  );

  const esimatedArrival = (): ReactNode => {
    if (showPriceAndTime && isAvailableTariff && availablePlans[defaultPlanIndex]) {
      return (
        <View style={[styles.timeContainer, computedStyles.timeContainer]}>
          <Text style={[styles.capacityText, computedStyles.timeText]}>
            {formatTime(Number(availablePlans[defaultPlanIndex].durationSec))}
          </Text>
        </View>
      );
    }

    return <></>;
  };

  const tariffTitleBlock = (
    <View style={styles.tariffTitleContainer}>
      <Text style={styles.title}>{tariffTitle}</Text>
      {isPhantomOfferLoading ? (
        <Skeleton
          skeletonContainerStyle={styles.skeletonTariffPrice}
          boneColor={passengerColors.tariffsColors.tariffGroupPriceLoadingColor}
        />
      ) : (
        esimatedArrival()
      )}
    </View>
  );

  const tariffPrice = () => {
    if (isAvailableTariff) {
      if (showPriceAndTime && availablePlans[defaultPlanIndex]) {
        return `${getCurrencySign(availablePlans[defaultPlanIndex].currency as CurrencyType)}${availablePlans[defaultPlanIndex].cost !== null ? availablePlans[defaultPlanIndex].cost : 0}`;
      }
    } else {
      return t('ride_Ride_TariffBar_notAvailable');
    }
  };

  let tariffContent = (
    <>
      <View style={computedStyles.imageContainer}>
        <AnimatedCarImage
          tariffType={tariff.name}
          containerStyle={computedStyles.image}
          startDelayInMilSec={carsAnimationDelayInMilSec}
          withAnimation={withAnimatedSmallCar}
        />
      </View>
      <View style={styles.infoContainer}>
        {tariffTitleBlock}
        {capacityBlock}
      </View>
      {isTariffsPricesLoading ? (
        <Skeleton
          skeletonContainerStyle={styles.skeletonTariffPrice}
          boneColor={passengerColors.tariffsColors.tariffGroupPriceLoadingColor}
        />
      ) : (
        <Text style={[styles.price, computedStyles.price]}>{tariffPrice()}</Text>
      )}
    </>
  );

  if (windowIsOpened) {
    tariffContent = (
      <>
        {tariffTitleBlock}
        <View style={computedStyles.imageContainer}>
          <AnimatedCarImage
            tariffType={tariff.name}
            containerStyle={computedStyles.image}
            startDelayInMilSec={carsAnimationDelayInMilSec}
            withAnimation={withAnimatedBigCars}
          />
        </View>
        {capacityBlock}
        {isTariffsPricesLoading ? (
          <Skeleton
            skeletonContainerStyle={styles.skeletonTariffPrice}
            boneColor={passengerColors.tariffsColors.tariffGroupPriceLoadingColor}
          />
        ) : (
          <Text style={[styles.price, computedStyles.price]}>{tariffPrice()}</Text>
        )}
      </>
    );
  }

  return (
    <Pressable style={computedStyles.wrapper} onPress={event => isAvailableTariff && onPress(event)}>
      <Animated.View style={[styles.container, animatedContainerStyles]}>
        <Animated.View style={[styles.tariffContainer, computedStyles.tariffContainer, animatedStyles.tariffContainer]}>
          {tariffContent}
        </Animated.View>
        {availablePlans.length > 1 && (
          <Animated.View style={animatedStyles.buttonWrapper}>
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
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  skeletonTariffPrice: {
    width: 60,
    height: 20,
    borderRadius: 4,
  },
  container: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 5,
    paddingTop: 18,
  },
  price: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    position: 'absolute',
    bottom: 0,
  },
  tariffContainer: {
    flex: 1,
  },
  infoContainer: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginLeft: 28,
    flex: 1,
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
  planButton: {
    marginTop: 20,
  },
  tariffTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexShrink: 1,
    alignSelf: 'stretch',
  },
  timeContainer: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 10,
  },
});

export default TariffBar;
