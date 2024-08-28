import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ButtonV1, ButtonV1Modes, Text, WarningIcon } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { setOrderStatus } from '../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../core/ride/redux/order/types';

const OrderCreationError = ({ error }: { error: string }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <Animated.View style={styles.wrapper} entering={FadeIn} exiting={FadeOut}>
      <View style={styles.titleWrapper}>
        <WarningIcon />
        <Text>{error}</Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <ButtonV1
          mode={ButtonV1Modes.Mode2}
          text={t('ride_Ride_OrderCreationError_cancelButton')}
          containerStyle={styles.button}
        />
        <ButtonV1
          text={t('ride_Ride_OrderCreationError_tryAgainButton')}
          containerStyle={styles.button}
          onPress={() => dispatch(setOrderStatus(OrderStatus.Confirmation))}
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

export default OrderCreationError;
