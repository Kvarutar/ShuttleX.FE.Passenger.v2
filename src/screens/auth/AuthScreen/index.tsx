import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, SignUpScreen } from 'shuttlex-integration';

import { AuthScreenProps } from './props';
import SignIn from './SignIn';
import TitleWithCloseButton from './TitleWithCloseButton';

const AuthScreen = ({ navigation, route }: AuthScreenProps): JSX.Element => {
  const [isSignIn, setIsisSignIn] = useState<boolean>(route.params.state === 'SignIn');
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <TitleWithCloseButton
        title={
          isSignIn ? t('auth_Auth_HeaderWithCloseButton_signInTitle') : t('auth_Auth_HeaderWithCloseButton_signUpTitle')
        }
        onBackButtonPress={() => navigation.replace('Splash')}
      />
      {isSignIn ? (
        <SignIn onPress={() => setIsisSignIn(false)} navigation={navigation} />
      ) : (
        <SignUpScreen
          navigateToSignIn={() => setIsisSignIn(true)}
          navigateToTerms={() => navigation.navigate('Terms')}
          navigateToSingUpCode={() => navigation.navigate('SignInPhoneCode')}
        />
      )}
    </SafeAreaView>
  );
};

export default AuthScreen;
