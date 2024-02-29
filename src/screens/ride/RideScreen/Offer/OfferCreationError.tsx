import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, ButtonModes, Text, WarningIcon } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { setOfferStatus } from '../../../../core/ride/redux/offer';
import { OfferStatus } from '../../../../core/ride/redux/offer/types';

const OfferCreationError = ({ error }: { error: string }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Animated.View style={styles.wrapper} entering={FadeIn} exiting={FadeOut}>
      <View style={styles.titleWrapper}>
        <WarningIcon />
        <Text>{error}</Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <Button
          mode={ButtonModes.Mode2}
          text={t('ride_Ride_OfferCreationError_cancelButton')}
          containerStyle={styles.button}
        />
        <Button
          text={t('ride_Ride_OfferCreationError_tryAgainButton')}
          containerStyle={styles.button}
          onPress={() => dispatch(setOfferStatus(OfferStatus.Confirmation))}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 24,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    gap: 22,
  },
  titleWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});

export default OfferCreationError;
