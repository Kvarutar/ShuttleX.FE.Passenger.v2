import { clamp, Easing, SharedValue, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';
import { WINDOW_HEIGHT } from 'shuttlex-integration';

import { cardHeight, cardOverlap } from '../consts';

export const useTicketAnimation = (
  index: number,
  scrollY: SharedValue<number>,
  activeCardIndex: SharedValue<number | null>,
) => {
  const translateY = useSharedValue(0);

  useAnimatedReaction(
    () => scrollY.value,
    current => {
      if (scrollY.value < 0) {
        translateY.value = clamp(Math.abs(scrollY.value) * 0.25 * (index + 1), 0, 80 * (index + 1));
      } else {
        translateY.value = -current;
      }
    },
  );

  useAnimatedReaction(
    () => activeCardIndex.value,
    (current, previous) => {
      if (current === previous) {
        return;
      }

      if (activeCardIndex.value === null) {
        translateY.value = withTiming(-scrollY.value);
        return;
      }

      if (activeCardIndex.value === index) {
        translateY.value = withTiming(-index * (cardHeight + cardOverlap), {
          easing: Easing.out(Easing.quad),
        });
        return;
      }

      if (activeCardIndex.value !== index) {
        translateY.value = withTiming(-index * (cardHeight + cardOverlap) * 0.7 + WINDOW_HEIGHT * 0.4, {
          easing: Easing.out(Easing.quad),
        });
        return;
      }
    },
  );

  return translateY;
};
