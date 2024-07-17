import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FeedbackScreen, FeedbackType, CustomKeyboardAvoidingView, sizes, useTheme } from 'shuttlex-integration';

import { selectedPaymentMethodSelector } from '../../../core/menu/redux/wallet/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { endTrip } from '../../../core/ride/redux/trip';
import { sendFeedback } from '../../../core/ride/redux/trip/thunks';
import { RatingScreenProps } from './props';

const RatingScreen = ({ navigation }: RatingScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const selectedPaymentMethod = useSelector(selectedPaymentMethodSelector);

  const computedStyles = StyleSheet.create({
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  const onSendFeedback = (feedback: FeedbackType) => {
    if (feedback.rating) {
      dispatch(sendFeedback(feedback));
    }
    navigation.navigate('Receipt');
  };

  const onEndTrip = () => {
    navigation.navigate('Ride');
    dispatch(endTrip());
  };

  if (!selectedPaymentMethod) {
    return <></>;
  }

  return (
    <CustomKeyboardAvoidingView>
      <SafeAreaView style={[styles.container, computedStyles.container]}>
        <FeedbackScreen
          onBackButtonPress={onEndTrip}
          isFeedbackForContractor
          title={t('ride_Rating_Feedback_title', { name: 'John' })}
          onSendFeedback={onSendFeedback}
          tipsVariants={selectedPaymentMethod.method !== 'cash' ? [2, 5, 10] : undefined}
          style={styles.feedback}
          userImageUrl="https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album"
        />
      </SafeAreaView>
    </CustomKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  feedback: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default RatingScreen;
