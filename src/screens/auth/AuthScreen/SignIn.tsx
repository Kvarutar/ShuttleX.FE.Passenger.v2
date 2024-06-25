import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, countryDtos, emailRegex, PhoneInput, Text, TextInput, useTheme } from 'shuttlex-integration';

import { SignInEmailStateProps, SignInPhoneStateProps, SignProps } from './props';

const SignIn = ({ onPress, navigation }: SignProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [isPhoneNumberSelected, setIsPhoneNumberSelected] = useState(true);

  const [isCorrectPhoneNumber, setIsCorrectPhoneNumber] = useState<boolean>(true);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  const [isCorrectEmail, setIsCorrectEmail] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');

  const navigationToSignInPhoneCodeScreen = () => {
    if (isPhoneNumberSelected) {
      const isCorrectPhoneNumberTemporary = Boolean(phoneNumber);
      setIsCorrectPhoneNumber(isCorrectPhoneNumberTemporary);
      if (isCorrectPhoneNumberTemporary) {
        navigation.navigate('SignInPhoneCode');
      }
    } else {
      const isCorrectEmailTemporary = emailRegex.test(email);
      setIsCorrectEmail(isCorrectEmailTemporary);
      if (isCorrectEmailTemporary) {
        navigation.navigate('SignInEmailCode');
      }
    }
  };

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
        {isPhoneNumberSelected ? (
          <Text style={styles.title}>{t('auth_Auth_SignIn_phoneTitle')}</Text>
        ) : (
          <Text style={styles.title}>{t('auth_Auth_SignIn_emailTitle')}</Text>
        )}

        {isPhoneNumberSelected ? (
          <SignInPhoneNumber
            navigation={navigation}
            isCorrectPhoneNumber={isCorrectPhoneNumber}
            changePhoneNumber={value => setPhoneNumber(value)}
            onLabelPress={() => setIsPhoneNumberSelected(false)}
          />
        ) : (
          <SignInEmail
            changeEmail={value => setEmail(value)}
            onLabelPress={() => setIsPhoneNumberSelected(true)}
            isCorrectEmail={isCorrectEmail}
          />
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

const SignInPhoneNumber = ({
  isCorrectPhoneNumber,
  onLabelPress,
  changePhoneNumber,
  navigation,
}: SignInPhoneStateProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [flagState, setFlagState] = useState(countryDtos[0]);

  const computedStyles = StyleSheet.create({
    dividerInputsLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <>
      <PhoneInput
        flagState={flagState}
        onFlagPress={() => navigation.navigate('PhoneSelect', { initialFlag: flagState, onFlagSelect: setFlagState })}
        error={{
          isError: !isCorrectPhoneNumber,
          message: t('auth_Auth_SignIn_phoneNumberError'),
        }}
        getPhoneNumber={(value: string | null) => {
          changePhoneNumber(value);
        }}
      />
      <Pressable onPress={onLabelPress} hitSlop={20}>
        <Text style={[styles.dividerInputsLabel, computedStyles.dividerInputsLabel]}>
          {t('auth_Auth_SignIn_signViaEmail')}
        </Text>
      </Pressable>
    </>
  );
};

const SignInEmail = ({ isCorrectEmail, onLabelPress, changeEmail }: SignInEmailStateProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    dividerInputsLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <>
      <TextInput
        error={{ isError: !isCorrectEmail, message: t('auth_Auth_SignIn_incorrectEmail') }}
        onChangeText={(value: string) => {
          changeEmail(value);
        }}
        placeholder={t('auth_Auth_SignIn_email')}
      />
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
  dividerInputsLabel: {
    fontFamily: 'Inter SemiBold',
    alignSelf: 'center',
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
