import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BaggageIcon, Bar, InfoIcon, ProfileIcon, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';

import PlanButton from './PlanButton';
import { TariffBarProps } from './props';

const TariffBar = ({ selectedPlan, selectedGroup, onPress, tariff, info, plans, windowIsOpened }: TariffBarProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const tariffsCarData = useTariffsIcons();

  const defaultPlanIndex = plans.length > 1 ? 1 : 0;
  const TariffImage = tariffsCarData[tariff].icon;
  const tariffTitle = tariffsCarData[tariff].text;

  const [selectedPrice, setSelectedPrice] = useState(defaultPlanIndex);

  const computedStyles = StyleSheet.create({
    capacityColor: {
      color: colors.iconSecondaryColor,
    },
    separateCircle: {
      backgroundColor: colors.iconSecondaryColor,
    },
    container: {
      borderColor: selectedPlan ? colors.borderColor : 'transparent',
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
      width: windowIsOpened ? '100%' : 100,
      alignItems: 'center',
    },
    image: {
      flex: windowIsOpened ? 1 : 0,
      width: windowIsOpened ? '90%' : '100%',
      resizeMode: 'contain',
    },
  });

  useEffect(() => {
    setSelectedPrice(1);
  }, [selectedGroup]);

  const animatedButtonWrapper = useAnimatedStyle(() => {
    return {
      height: withTiming(selectedPlan ? 76 : 0, { duration: 200 }),
    };
  });

  const animatedTariffContainer = useAnimatedStyle(() => {
    return {
      height: withTiming(windowIsOpened ? 200 : 52, { duration: 300 }),
    };
  });

  const capacityBlock = (
    <View style={styles.capacityContainer}>
      {plans.length === 1 && (
        <>
          <Text style={[styles.capacityText, computedStyles.capacityColor]}>
            {t('ride_Ride_Tariffs_minutes', { count: Number(plans[defaultPlanIndex].time) })}
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

  const titleBlock = (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{tariffTitle}</Text>
      <Pressable>
        <InfoIcon />
      </Pressable>
    </View>
  );

  return (
    <Bar style={[styles.container, computedStyles.container]} onPress={onPress}>
      <Animated.View style={[styles.tariffContainer, computedStyles.tariffContainer, animatedTariffContainer]}>
        {windowIsOpened && titleBlock}
        <View style={computedStyles.imageContainer}>
          <TariffImage style={computedStyles.image} />
        </View>
        {windowIsOpened ? (
          capacityBlock
        ) : (
          <View style={styles.infoContainer}>
            {titleBlock}
            {capacityBlock}
          </View>
        )}
        {(!selectedPlan || plans.length === 1) && (
          <Text
            style={[styles.isNotSelectedPrice, computedStyles.isNotSelectedPrice, styles.price, computedStyles.price]}
          >
            ${plans[defaultPlanIndex].price}
          </Text>
        )}
      </Animated.View>
      {plans.length !== 1 && (
        <Animated.View style={[styles.buttonWrapper, animatedButtonWrapper]}>
          {plans.map((button, index) => (
            <PlanButton
              key={`tariff_button_${index}`}
              onPress={() => setSelectedPrice(index)}
              selectedPrice={selectedPrice === index}
              time={button.time}
              price={button.price}
              index={index}
            />
          ))}
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
  buttonWrapper: {
    flexDirection: 'row',
    gap: 5,
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
});

export default TariffBar;
