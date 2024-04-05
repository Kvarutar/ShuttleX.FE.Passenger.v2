import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bar, Blur, Button, CloseIcon, RoundButton, ShortArrowIcon, sizes } from 'shuttlex-integration';

import { AddressPopupProps } from './props';

const animationDuration = {
  closeButtonDuration: 300,
  bottomWindowDuration: 500,
};

const AddressPopup = ({
  children,
  showConfirmButton,
  style,
  onBackButtonPress,
  onCloseButtonPress,
  barStyle,
  additionalTopButtons,
  onConfirm,
}: AddressPopupProps) => {
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  return (
    <>
      <Blur />
      <Animated.View
        entering={FadeIn.duration(animationDuration.closeButtonDuration)}
        exiting={FadeOut.duration(animationDuration.closeButtonDuration)}
        style={StyleSheet.absoluteFill}
      >
        <SafeAreaView style={[styles.container, computedStyles.container, style]}>
          <View>
            <View style={styles.barTopButtons}>
              {onBackButtonPress && (
                <RoundButton onPress={onBackButtonPress}>
                  <ShortArrowIcon />
                </RoundButton>
              )}
              {onCloseButtonPress && (
                <RoundButton style={styles.closeButton} onPress={onCloseButtonPress}>
                  <CloseIcon />
                </RoundButton>
              )}
              {additionalTopButtons}
            </View>
            <Bar style={barStyle}>{children}</Bar>
          </View>
          {showConfirmButton && onConfirm && (
            <Animated.View
              style={styles.buttonWrapper}
              entering={FadeIn.duration(animationDuration.closeButtonDuration)}
              exiting={FadeOut.duration(animationDuration.closeButtonDuration)}
            >
              <Button text={t('ride_Ride_AddressPopup_confirmButton')} onPress={onConfirm} />
            </Animated.View>
          )}
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  barTopButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.paddingHorizontal,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 26,
    marginRight: sizes.paddingHorizontal,
  },
  buttonWrapper: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
});

export default AddressPopup;
