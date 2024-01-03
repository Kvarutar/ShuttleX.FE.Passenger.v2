import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, CodeInput, RoundButton, ShortArrowIcon, sizes, Text, useTheme } from 'shuttlex-integration';

import { SignInEmailCodeScreenProps } from './props';

const SignInEmailCodeScreen = ({ navigation }: SignInEmailCodeScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const goBackToScreen = () => navigation.goBack();

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    signUpLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <View style={[styles.header]}>
        <RoundButton onPress={goBackToScreen}>
          <ShortArrowIcon />
        </RoundButton>
        <Text style={[styles.headerTitle]}>{t('auth_SignInPhoneCode_headerTitle')}</Text>
        <View style={styles.headerDummy} />
      </View>

      <Text style={[styles.codeText]}>{t('auth_SignInPhoneCode_prompt')}</Text>

      <CodeInput style={styles.codeInput} onCodeChange={() => {}} />

      <Button text={t('auth_SignInPhoneCode_button')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  codeText: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter Medium',
    marginTop: 64,
  },
  codeInput: {
    flex: 1,
    gap: 30,
    marginTop: 50,
    alignSelf: 'center',
  },
  signUpLabel: {
    fontFamily: 'Inter Medium',
  },
  headerDummy: {
    width: 50,
  },
});

export default SignInEmailCodeScreen;
