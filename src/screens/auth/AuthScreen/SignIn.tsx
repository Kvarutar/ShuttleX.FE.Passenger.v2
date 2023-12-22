import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, PhoneInput, Text, useTheme } from 'shuttlex-integration';

import { SignProps } from './props';

const SignIn = ({ onPress }: SignProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    signUpLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <>
      <View style={styles.phoneNumberContainer}>
        <Text style={styles.title}>{t('auth_Auth_SignIn_title')}</Text>
        <PhoneInput />
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Button text={t('auth_Auth_SignIn_nextButton')} />
        <Pressable style={styles.dontHaveAccountContainer} onPress={onPress} hitSlop={20}>
          <Text style={styles.dontHaveAccountText}>
            {t('auth_Auth_SignIn_dontHaveAccount')}{' '}
            <Text style={[styles.signUpLabel, computedStyles.signUpLabel]}>{t('auth_Auth_SignIn_signUpButton')}</Text>
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  phoneNumberContainer: {
    flex: 1,
    gap: 30,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter Medium',
  },
  bottomButtonsContainer: {
    gap: 32,
  },
  dontHaveAccountContainer: {
    alignSelf: 'center',
  },
  dontHaveAccountText: {
    fontFamily: 'Inter Medium',
  },
  signUpLabel: {
    fontFamily: 'Inter Medium',
  },
});

export default SignIn;
