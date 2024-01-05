import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, PhoneInput, Text, TextInput, useTheme } from 'shuttlex-integration';

import { SignInPhoneAndEmailStateProps, SignProps } from './props';

const SignIn = ({ onPress, navigation }: SignProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [isPhoneNumberSelected, setIsPhoneNumberSelected] = useState(true);

  const navigationToSignInPhoneCodeScreen = () =>
    isPhoneNumberSelected ? navigation.navigate('SignInPhoneCode') : navigation.navigate('SignInEmailCode');

  const computedStyles = StyleSheet.create({
    signUpLabel: {
      color: colors.primaryColor,
    },
    dividerInputsLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <>
      <View style={styles.phoneNumberContainer}>
        <Text style={styles.title}>{t('auth_Auth_SignIn_title')}</Text>
        {isPhoneNumberSelected ? (
          <SignInPhoneNumber onLabelPress={() => setIsPhoneNumberSelected(false)} />
        ) : (
          <SignInEmail onLabelPress={() => setIsPhoneNumberSelected(true)} />
        )}
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Button text={t('auth_Auth_SignIn_nextButton')} onPress={navigationToSignInPhoneCodeScreen} />
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

const SignInPhoneNumber = ({ onLabelPress }: SignInPhoneAndEmailStateProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    dividerInputsLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <>
      <PhoneInput />
      <Pressable onPress={onLabelPress} hitSlop={20}>
        <Text style={[styles.dividerInputsLabel, computedStyles.dividerInputsLabel]}>
          {t('auth_Auth_SignIn_signViaEmail')}
        </Text>
      </Pressable>
    </>
  );
};

const SignInEmail = ({ onLabelPress }: SignInPhoneAndEmailStateProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    dividerInputsLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <>
      <TextInput placeholder={t('auth_Auth_SignIn_email')} />
      <Pressable onPress={onLabelPress} hitSlop={20}>
        <Text style={[styles.dividerInputsLabel, computedStyles.dividerInputsLabel]}>
          {t('auth_Auth_SignIn_signViaPhoneNumber')}
        </Text>
      </Pressable>
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
  dividerInputsLabel: {
    fontFamily: 'Inter SemiBold',
    alignSelf: 'center',
  },
});

export default SignIn;
