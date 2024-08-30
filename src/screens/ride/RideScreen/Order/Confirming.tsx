import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ButtonV1, ButtonV1Modes, Text, Timer, TimerModes, useThemeV1 } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { createOrder } from '../../../../core/ride/redux/order/thunks';

const Confirming = ({ onCancel }: { onCancel: () => void }) => {
  const { colors } = useThemeV1();
  const { t } = useTranslation();
  const [dotsCounter, setDotsCounter] = useState(3);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setDotsCounter(prevCount => {
        if (prevCount > 2) {
          return 1;
        }
        return prevCount + 1;
      });
    }, 400);

    dispatch(createOrder());

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Animated.View style={styles.wrapper} entering={FadeIn} exiting={FadeOut}>
      <Text>{t('ride_Ride_Confirming_confirming', { dots: '.'.repeat(dotsCounter) })}</Text>
      <Timer
        withCountdown={false}
        startColor={colors.secondaryGradientStartColor}
        endColor={colors.secondaryGradientEndColor}
        mode={TimerModes.Mini}
      />
      <ButtonV1
        mode={ButtonV1Modes.Mode3}
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
