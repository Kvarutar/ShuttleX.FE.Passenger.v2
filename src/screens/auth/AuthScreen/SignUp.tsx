import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { getLocales } from 'react-native-localize';
import {
  Button,
  CheckBox,
  DatePicker,
  emailRegex,
  PhoneInput,
  ScrollViewWithCustomScroll,
  Text,
  TextInput,
  useTheme,
} from 'shuttlex-integration';

import { correctValidationUserDataFormProps, SignProps } from './props';

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

  type FormProps = {
    firstName: string;
    lastName: string;
    birthDate: null | Date;
    email: string;
    phoneNumber: string | null;
    isFamiliarWithTermsAndConditions: boolean;
    isAllowedProccessPersonalData: boolean;
  };

  const navigationToSignUpPhoneCodeScreen = () => {
    navigation.navigate('SignUpPhoneCode');
  };

  const getInitialForm = (): correctValidationUserDataFormProps => ({
    correctName: true,
    correctLastName: true,
    correctEmail: true,
    correctDate: true,
    correctPhoneNumber: true,
    correctFamiliarWithTermsAndConditions: true,
    correctAllowedProccessPersonalData: true,
  });

  const [isFormCorrect, setIsCorrectForm] = useState<correctValidationUserDataFormProps>(getInitialForm);

  const checkLength = (text: string) => text.length <= 30 && text.length >= 2;

  const checkSignUpDataCollectionForm = () => {
    const isCorrectTemporaryForm = getInitialForm();

    isCorrectTemporaryForm.correctName = checkLength(userDataForm.firstName);
    isCorrectTemporaryForm.correctLastName = checkLength(userDataForm.lastName);
    isCorrectTemporaryForm.correctEmail = emailRegex.test(userDataForm.email);
    isCorrectTemporaryForm.correctDate = Boolean(userDataForm.birthDate);
    isCorrectTemporaryForm.correctPhoneNumber = Boolean(userDataForm.phoneNumber);
    isCorrectTemporaryForm.correctFamiliarWithTermsAndConditions = userDataForm.isFamiliarWithTermsAndConditions;
    isCorrectTemporaryForm.correctAllowedProccessPersonalData = userDataForm.isAllowedProccessPersonalData;

    setIsCorrectForm(isCorrectTemporaryForm);

    if (!Object.values(isCorrectTemporaryForm).includes(false)) {
      navigationToSignUpPhoneCodeScreen();
    }
  };

  const [userDataForm, setUserDataForm] = useState<FormProps>({
    firstName: '',
    lastName: '',
    birthDate: null,
    email: '',
    phoneNumber: null,
    isFamiliarWithTermsAndConditions: false,
    isAllowedProccessPersonalData: false,
  });

  const computedStyles = StyleSheet.create({
    signInLabel: {
      color: colors.primaryColor,
    },
    checkBoxText: {
      color: colors.textSecondaryColor,
    },
    errorCheckboxLink: {
      color: colors.errorColor,
    },
  });

  return (
    <>
      <ScrollViewWithCustomScroll contentContainerStyle={styles.formSignUpContainer}>
        <TextInput
          error={{ isError: !isFormCorrect.correctName, message: t('auth_Auth_SignUp_incorrectName') }}
          placeholder={t('auth_Auth_SignUp_nameInputPlaceholder')}
          onChangeText={(value: string) => {
            setUserDataForm(prev => ({
              ...prev,
              firstName: value,
            }));
          }}
          value={userDataForm.firstName}
        />
        <TextInput
          error={{
            isError: !isFormCorrect.correctLastName,
            message: t('auth_Auth_SignUp_incorrectLastName'),
          }}
          placeholder={t('auth_Auth_SignUp_lastNameInputPlaceholder')}
          onChangeText={(value: string) =>
            setUserDataForm(prev => ({
              ...prev,
              lastName: value,
            }))
          }
        />
        <DatePicker
          error={{
            isError: !isFormCorrect.correctDate,
            message: t('auth_Auth_SignUp_requiredDateOfBirth'),
          }}
          onDateSelect={(date: Date) => {
            setUserDataForm(prev => ({
              ...prev,
              birthDate: date,
            }));
          }}
          placeholder={t('auth_Auth_SignUp_datePickerPlaceholder')}
          maximumDate={maximumDate}
          formatDate={formatDate}
        />
        <TextInput
          error={{ isError: !isFormCorrect.correctEmail, message: t('auth_Auth_SignUp_incorrectEmail') }}
          placeholder={t('auth_Auth_SignUp_email')}
          onChangeText={(value: string) =>
            setUserDataForm(prev => ({
              ...prev,
              email: value,
            }))
          }
        />
        <PhoneInput
          error={{
            isError: !isFormCorrect.correctPhoneNumber,
            message: t('auth_Auth_SignUp_phoneNumberError'),
          }}
          getPhoneNumber={(phoneNumber: string | null) => {
            setUserDataForm(prev => ({
              ...prev,
              phoneNumber: phoneNumber,
            }));
          }}
        />
        <CheckBox
          error={{
            isError: !isFormCorrect.correctFamiliarWithTermsAndConditions,
            message: t('auth_Auth_SignUp_checkBoxError'),
          }}
          getCheckValue={(value: boolean) => {
            setUserDataForm(prev => ({
              ...prev,
              isFamiliarWithTermsAndConditions: value,
            }));
          }}
          text={t('auth_Auth_SignUp_agree')}
        >
          <Pressable onPress={navigationToSignUpPhoneCodeScreen} hitSlop={20}>
            <Text
              style={[
                styles.checkBoxText,
                computedStyles.checkBoxText,
                !isFormCorrect.correctFamiliarWithTermsAndConditions && computedStyles.errorCheckboxLink,
              ]}
            >
              {t('auth_Auth_SignUp_termsAndConditions')}
            </Text>
          </Pressable>
        </CheckBox>

        <CheckBox
          error={{
            isError: !isFormCorrect.correctAllowedProccessPersonalData,
            message: t('auth_Auth_SignUp_checkBoxError'),
          }}
          getCheckValue={(value: boolean) => {
            setUserDataForm(prev => ({
              ...prev,
              isAllowedProccessPersonalData: value,
            }));
          }}
          text={t('auth_Auth_SignUp_allowProcess')}
        >
          <Pressable onPress={navigationToSignUpPhoneCodeScreen} hitSlop={20}>
            <Text
              style={[
                styles.checkBoxText,
                computedStyles.checkBoxText,
                !isFormCorrect.correctAllowedProccessPersonalData && computedStyles.errorCheckboxLink,
              ]}
            >
              {t('auth_Auth_SignUp_personalData')}
            </Text>
          </Pressable>
        </CheckBox>
      </ScrollViewWithCustomScroll>

      <View style={styles.buttonsContainer}>
        <Button text={t('auth_Auth_SignUp_createAccountButton')} onPress={checkSignUpDataCollectionForm} />
        <Pressable style={styles.alreadyHaveAccountContainer} onPress={onPress} hitSlop={20}>
          <Text style={styles.alreadyHaveAccountText}>
            {t('auth_Auth_SignUp_haveAccount')}{' '}
            <Text style={[styles.signInLabel, computedStyles.signInLabel]}>{t('auth_Auth_SignUp_signInButton')}</Text>
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formSignUpContainer: {
    gap: 24,
  },
  buttonsContainer: {
    marginTop: 30,
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
  checkBoxText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

export default SignUp;
