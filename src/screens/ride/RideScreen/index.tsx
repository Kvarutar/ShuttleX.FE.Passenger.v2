import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  BottomWindow,
  Button,
  ButtonModes,
  ButtonShadows,
  ClockIcon,
  MenuIcon,
  NotificationIcon,
  RoundButton,
  ShortArrowIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { RideScreenProps } from './props';

const RideScreen = ({}: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const startBottomWindowComputedStyles = StyleSheet.create({
    button: { backgroundColor: colors.backgroundPrimaryColor },
    buttonText: { color: colors.textSecondaryColor },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.map}>
        <Text>Map</Text>
      </View>
      <View style={styles.topButtonsContainer}>
        <RoundButton>
          <MenuIcon />
        </RoundButton>
        <RoundButton>
          <NotificationIcon />
        </RoundButton>
      </View>
      <BottomWindow>
        <Button
          buttonStyle={[startBottomWindowStyles.button, startBottomWindowComputedStyles.button]}
          shadow={ButtonShadows.Strong}
        >
          <Text style={startBottomWindowComputedStyles.buttonText}>{t('ride_Ride_startBottomWindow_buttonText')}</Text>
          <Button mode={ButtonModes.Mode4} buttonStyle={startBottomWindowStyles.timeButton}>
            <ClockIcon color={colors.backgroundTertiaryColor} />
            <Text style={startBottomWindowStyles.timeButtonText}>
              {t('ride_Ride_startBottomWindow_timeButtonText')}
            </Text>
            <ShortArrowIcon style={startBottomWindowStyles.timeButtonArrow} />
          </Button>
        </Button>
      </BottomWindow>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  topButtonsContainer: {
    position: 'absolute',
    left: sizes.paddingHorizontal,
    right: sizes.paddingHorizontal,
    top: sizes.paddingVertical,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

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

export default RideScreen;
