import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, CodeInput, RoundButton, ShortArrowIcon, sizes, Text, useTheme } from 'shuttlex-integration';

import { SignInEmailCodeScreenProps } from './props';

const SignInEmailCodeScreen = ({ navigation }: SignInEmailCodeScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const goBackToScreen = () => navigation.goBack();

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    signUpLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
        <View style={[styles.header]}>
          <RoundButton onPress={goBackToScreen}>
            <ShortArrowIcon />
          </RoundButton>
          <Text style={[styles.headerTitle]}>{t('auth_SignInEmailCode_headerTitle')}</Text>
          <View style={styles.headerDummy} />
        </View>

        <Text style={[styles.codeText]}>{t('auth_SignInEmailCode_prompt')}</Text>

        <CodeInput style={styles.codeInput} onCodeChange={() => {}} />

        <Button text={t('auth_SignInEmailCode_button')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
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
