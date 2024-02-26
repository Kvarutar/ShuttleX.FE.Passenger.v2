import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import { Button, DatePicker, PhoneInput, Text, TextInput, useTheme } from 'shuttlex-integration';

import { SignProps } from './props';

const maximumDate = new Date();
maximumDate.setFullYear(maximumDate.getFullYear() - 18);

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat(getLocales()[0].languageTag, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(date)
    .replace(/[^+\d]/g, '-');

const SignUp = ({ onPress, navigation }: SignProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const navigationToSignUpPhoneCodeScreen = () => navigation.navigate('SignUpPhoneCode');

  const computedStyles = StyleSheet.create({
    signInLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formSignUpContainer}>
        <TextInput placeholder={t('auth_Auth_SignUp_nameInputPlaceholder')} />
        <TextInput placeholder={t('auth_Auth_SignUp_lastNameInputPlaceholder')} />
        <DatePicker
          onDateSelect={() => {}}
          placeholder={t('auth_Auth_SignUp_datePickerPlaceholder')}
          maximumDate={maximumDate}
          formatDate={formatDate}
        />
        <TextInput placeholder="Email" />
        <PhoneInput getPhoneNumber={() => {}} />
      </View>

      <View style={styles.buttonsContainer}>
        <Button text={t('auth_Auth_SignUp_createAccountButton')} onPress={navigationToSignUpPhoneCodeScreen} />
        <Pressable style={styles.alreadyHaveAccountContainer} onPress={onPress} hitSlop={20}>
          <Text style={styles.alreadyHaveAccountText}>
            {t('auth_Auth_SignUp_haveAccount')}{' '}
            <Text style={[styles.signInLabel, computedStyles.signInLabel]}>{t('auth_Auth_SignUp_signInButton')}</Text>
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  formSignUpContainer: {
    flex: 1,
    gap: 24,
  },
  buttonsContainer: {
    gap: 32,
  },
  alreadyHaveAccountContainer: {
    alignSelf: 'center',
  },
  alreadyHaveAccountText: {
    fontFamily: 'Inter Medium',
  },
  signInLabel: {
    fontFamily: 'Inter Medium',
  },
});

export default SignUp;
