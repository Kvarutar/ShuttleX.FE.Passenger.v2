import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, CodeInput, RoundButton, SafeAreaView, ShortArrowIcon, Text } from 'shuttlex-integration';

import { SignInPhoneCodeScreenProps } from './props';

const SignInPhoneCodeScreen = ({ navigation }: SignInPhoneCodeScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <RoundButton onPress={navigation.goBack}>
          <ShortArrowIcon />
        </RoundButton>
        <Text style={styles.headerTitle}>{t('auth_SignInPhoneCode_headerTitle')}</Text>
        <View style={styles.headerDummy} />
      </View>

      <Text style={styles.codeText}>{t('auth_SignInPhoneCode_prompt')}</Text>

      <CodeInput style={styles.codeInput} onCodeChange={() => {}} />

      <Button text={t('auth_SignInPhoneCode_button')} onPress={() => navigation.replace('Ride')} />
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
