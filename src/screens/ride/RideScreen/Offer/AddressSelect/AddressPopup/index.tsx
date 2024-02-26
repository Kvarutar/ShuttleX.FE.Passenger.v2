import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
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

  return (
    <>
      <Blur />
      <Animated.View
        entering={FadeIn.duration(animationDuration.closeButtonDuration)}
        exiting={FadeOut.duration(animationDuration.closeButtonDuration)}
        style={[styles.barWrapper, style]}
      >
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
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    top: sizes.paddingVertical,
    bottom: 0,
    left: 0,
    right: 0,
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
    marginBottom: sizes.paddingVertical,
    paddingHorizontal: sizes.paddingHorizontal,
  },
});

export default AddressPopup;
