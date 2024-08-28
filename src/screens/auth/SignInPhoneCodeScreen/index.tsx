import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ButtonV1, ButtonV1Shapes, CodeInput, SafeAreaView, ShortArrowIcon, Text } from 'shuttlex-integration';

import { calculateLockoutTime, incrementAttempts, setLockoutEndTimestamp } from '../../../core/auth/redux/lockout';
import { selectLockoutAttempts, selectLockoutEndTimestamp } from '../../../core/auth/redux/lockout/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { SignInPhoneCodeScreenProps } from './props';

const SignInPhoneCodeScreen = ({ navigation }: SignInPhoneCodeScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const lockoutAttempts = useSelector(selectLockoutAttempts);
  const lockoutEndTimestamp = useSelector(selectLockoutEndTimestamp);

  const onRequestAgainPress = () => {
    dispatch(incrementAttempts());

    const newLockoutTime = calculateLockoutTime(lockoutAttempts + 1);
    if (newLockoutTime > 0 && newLockoutTime !== lockoutEndTimestamp) {
      dispatch(setLockoutEndTimestamp(newLockoutTime));

      navigation.navigate('LockOut');
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <ButtonV1 onPress={navigation.goBack} shape={ButtonV1Shapes.Circle}>
          <ShortArrowIcon />
        </ButtonV1>
        <Text style={styles.headerTitle}>{t('auth_SignInPhoneCode_headerTitle')}</Text>
        <View style={styles.headerDummy} />
      </View>

      <Text style={styles.codeText}>{t('auth_SignInPhoneCode_prompt')}</Text>

      <CodeInput style={styles.codeInput} onCodeChange={() => {}} />

      <View style={styles.buttons}>
        <ButtonV1 text={t('auth_SignInPhoneCode_requestAgainButton')} onPress={onRequestAgainPress} />
        <ButtonV1 text={t('auth_SignInPhoneCode_button')} onPress={() => navigation.replace('Ride')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  buttons: {
    gap: 20,
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

export default SignInPhoneCodeScreen;
