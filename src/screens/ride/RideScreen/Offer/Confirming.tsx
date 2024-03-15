import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Button, ButtonModes, Text, Timer, TimerModes, useTheme } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { cleanOffer } from '../../../../core/ride/redux/offer';
import { OfferTariffSelector } from '../../../../core/ride/redux/offer/selectors';
import { setOrder } from '../../../../core/ride/redux/trip';

const Confirming = ({ onCancel }: { onCancel: () => void }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [dotsCounter, setDotsCounter] = useState(3);
  const dispatch = useAppDispatch();
  const selectedTariff = useSelector(OfferTariffSelector);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotsCounter(prevCount => {
        if (prevCount > 2) {
          return 1;
        }
        return prevCount + 1;
      });
    }, 400);

    setTimeout(() => {
      dispatch(
        setOrder({
          contractor: {
            name: 'Benedict',
            car: {
              model: 'Toyota Land Cruser',
              plateNumber: 'BPNW 958',
            },
            phone: '89990622720',
          },
          tripType: selectedTariff ?? 'BasicX',
          total: '68.90',
        }),
      );
      dispatch(cleanOffer());
    }, 4000); //forTest

    return () => clearInterval(interval);
  }, [dispatch, selectedTariff]);

  return (
    <Animated.View style={styles.wrapper} entering={FadeIn} exiting={FadeOut}>
      <Text>{t('ride_Ride_Confirming_confirming', { dots: '.'.repeat(dotsCounter) })}</Text>
      <Timer
        withCountdown={false}
        startColor={colors.secondaryGradientStartColor}
        endColor={colors.secondaryGradientEndColor}
        mode={TimerModes.Mini}
      />
      <Button
        mode={ButtonModes.Mode3}
        text={t('ride_Ride_Confirming_cancelButton')}
        containerStyle={styles.button}
        onPress={onCancel}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 20,
  },
  button: {
    alignSelf: 'stretch',
  },
});

export default Confirming;
