import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, ButtonModes, ButtonShadows, ClockIcon, ShortArrowIcon, Text, useTheme } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { setOfferStatus } from '../../../../core/ride/redux/offer';
import { OfferStatus } from '../../../../core/ride/redux/offer/types';

const StartRide = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const startBottomWindowComputedStyles = StyleSheet.create({
    button: { backgroundColor: colors.backgroundPrimaryColor },
    buttonText: { color: colors.textSecondaryColor },
  });

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Button
        buttonStyle={[startBottomWindowStyles.button, startBottomWindowComputedStyles.button]}
        shadow={ButtonShadows.Strong}
      >
        <Text style={startBottomWindowComputedStyles.buttonText}>{t('ride_Ride_startBottomWindow_button')}</Text>
        <Button
          mode={ButtonModes.Mode4}
          buttonStyle={startBottomWindowStyles.timeButton}
          onPress={() => dispatch(setOfferStatus(OfferStatus.ChoosingTariff))}
        >
          <ClockIcon color={colors.backgroundTertiaryColor} />
          <Text style={startBottomWindowStyles.timeButtonText}>{t('ride_Ride_startBottomWindow_timeButton')}</Text>
          <ShortArrowIcon style={startBottomWindowStyles.timeButtonArrow} />
        </Button>
      </Button>
    </Animated.View>
  );
};

const startBottomWindowStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingRight: 12,
  },
  timeButton: {
    flexDirection: 'row',
    gap: 16,
    height: 40,
    paddingHorizontal: 8,
  },
  timeButtonText: {
    fontFamily: 'Inter Medium',
  },
  timeButtonArrow: {
    transform: [{ rotate: '180deg' }],
  },
});

export default StartRide;
