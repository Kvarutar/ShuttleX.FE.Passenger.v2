import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  ButtonV1,
  ButtonV1Modes,
  ButtonV1Shadows,
  ClockIcon,
  ShortArrowIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { AddressSelectMode } from './AddressSelect/props';

const StartRide = ({ openAddressSelect }: { openAddressSelect: (mode: AddressSelectMode) => void }) => {
  const { colors, themeMode } = useTheme();
  const { t } = useTranslation();

  const startBottomWindowComputedStyles = StyleSheet.create({
    button: {
      backgroundColor: themeMode === 'light' ? colors.backgroundPrimaryColor : colors.backgroundSecondaryColor,
    },
    buttonText: { color: colors.textSecondaryColor },
    timeButtonText: themeMode !== 'light' ? { color: colors.textTertiaryColor } : {},
  });

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <ButtonV1
        style={[startBottomWindowStyles.button, startBottomWindowComputedStyles.button]}
        shadow={ButtonV1Shadows.Strong}
        onPress={() => openAddressSelect('now')}
      >
        <Text style={startBottomWindowComputedStyles.buttonText}>{t('ride_Ride_startBottomWindow_button')}</Text>
        <ButtonV1
          mode={ButtonV1Modes.Mode4}
          style={startBottomWindowStyles.timeButton}
          onPress={() => openAddressSelect('delayed')}
        >
          <ClockIcon color={themeMode === 'light' ? colors.iconPrimaryColor : colors.textTertiaryColor} />
          <Text style={[startBottomWindowStyles.timeButtonText, startBottomWindowComputedStyles.timeButtonText]}>
            {t('ride_Ride_startBottomWindow_timeButton')}
          </Text>
          <ShortArrowIcon
            style={startBottomWindowStyles.timeButtonArrow}
            color={themeMode !== 'light' ? colors.textTertiaryColor : undefined}
          />
        </ButtonV1>
      </ButtonV1>
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
