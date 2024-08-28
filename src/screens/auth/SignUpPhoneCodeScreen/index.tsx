import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ButtonV1, ButtonV1Shapes, CodeInput, SafeAreaView, ShortArrowIcon, Text } from 'shuttlex-integration';

import { SignUpPhoneCodeScreenProps } from './props';

const SignUpPhoneCodeScreen = ({ navigation }: SignUpPhoneCodeScreenProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <ButtonV1 shape={ButtonV1Shapes.Circle} onPress={navigation.goBack}>
          <ShortArrowIcon />
        </ButtonV1>
        <Text style={styles.headerTitle}>{t('auth_SignUpPhoneCode_headerTitle')}</Text>
        <View style={styles.headerDummy} />
      </View>

      <Text style={styles.codeText}>{t('auth_SignUpPhoneCode_prompt')}</Text>

      <CodeInput style={styles.codeInput} onCodeChange={() => {}} />

      <ButtonV1 text={t('auth_SignUpPhoneCode_button')} onPress={() => navigation.replace('Ride')} />
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

export default SignUpPhoneCodeScreen;
