import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, ButtonModes, Text, Timer, TimerModes, useTheme } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { setContractorInfo } from '../../../../core/ride/redux/trip';

const Confirming = ({ onCancel }: { onCancel: () => void }) => {
  const { colors } = useTheme();
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

    setTimeout(
      () =>
        dispatch(
          setContractorInfo({
            name: 'Benedict',
            car: {
              model: 'Toyota Land Cruser',
              plateNumber: 'BPNW 958',
            },
          }),
        ),
      4000,
    ); //forTest

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Animated.View style={styles.wrapper} entering={FadeIn} exiting={FadeOut}>
      <Text>Confirming{'.'.repeat(dotsCounter)}</Text>
      <Timer
        withCountdown={false}
        startColor={colors.secondaryGradientStartColor}
        endColor={colors.secondaryGradientEndColor}
        mode={TimerModes.Mini}
      />
      <Button mode={ButtonModes.Mode3} text="Cancel" style={styles.button} onPress={onCancel} />
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
