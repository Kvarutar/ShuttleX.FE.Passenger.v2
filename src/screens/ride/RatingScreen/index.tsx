import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { FeedbackScreen, FeedbackType, sizes, useTheme } from 'shuttlex-integration';

import { useKeyboardAutoSoftInputModeAndroid } from '../../../core/utils/hooks';
import { RatingScreenProps } from './props';

const RatingScreen = ({ navigation }: RatingScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  useKeyboardAutoSoftInputModeAndroid();

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  const onSendFeedback = (feedback: FeedbackType) => {
    console.log(feedback);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.wrapper, computedStyles.wrapper]}
    >
      <SafeAreaView style={[styles.container, computedStyles.container]}>
        <FeedbackScreen
          onBackButtonPress={() => navigation.goBack()}
          isFeedbackForContractor
          title={t('ride_Rating_Feedback_title', { name: 'John' })}
          onSendFeedback={onSendFeedback}
          tipsVariants={[2, 5, 10]}
          style={styles.feedback}
          userImageUrl="https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album"
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
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
