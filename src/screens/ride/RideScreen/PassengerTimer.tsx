import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Timer, TimerModes, useTheme } from 'shuttlex-integration';

const timerAnimationDuration = 300;

const PassengerTimer = ({
  isPassengerLate,
  setIsPassengerLate,
}: {
  isPassengerLate: boolean;
  setIsPassengerLate: () => void;
}) => {
  const { colors } = useTheme();
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    setCurrentTime(new Date().getTime() + 180000);
  }, []);

  if (isPassengerLate) {
    return (
      <Animated.View
        exiting={FadeOut.duration(timerAnimationDuration)}
        entering={FadeIn.duration(timerAnimationDuration)}
        style={styles.additionalHeaderButtons}
      >
        <Timer
          initialDate={new Date()}
          startColor={colors.secondaryGradientStartColor}
          endColor={colors.secondaryGradientEndColor}
          mode={TimerModes.Mini}
        />
      </Animated.View>
    );
  } else {
    return (
      <Animated.View
        exiting={FadeOut.duration(timerAnimationDuration)}
        entering={FadeIn.duration(timerAnimationDuration)}
        style={styles.additionalHeaderButtons}
      >
        <Timer
          initialDate={new Date(currentTime)} //20000 - for test
          onAfterCountdownEnds={setIsPassengerLate}
          startColor={colors.primaryGradientStartColor}
          endColor={colors.primaryColor}
          mode={TimerModes.Mini}
        />
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
  additionalHeaderButtons: {
    marginTop: 30,
  },
});

export default PassengerTimer;
