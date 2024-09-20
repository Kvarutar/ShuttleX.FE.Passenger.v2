import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, SignInScreen, SignUpForm, SignUpScreen, SignUpScreenRef } from 'shuttlex-integration';

import { AuthScreenProps } from './props';
import TitleWithCloseButton from './TitleWithCloseButton';

const AuthScreen = ({ navigation, route }: AuthScreenProps): JSX.Element => {
  const [isSignIn, setIsisSignIn] = useState<boolean>(route.params.state === 'SignIn');
  const { t } = useTranslation();
  const signUpRef = useRef<SignUpScreenRef>(null);

  const handleSendingSignUpData = (dataForm: SignUpForm) => {
    //TODO add logic for send data on back
    if (signUpRef.current && dataForm.email === 'qwe@qwe.com') {
      signUpRef.current.showErrors({ email: 'Email is already in use' });
      return;
    }
    navigation.navigate('SignInPhoneCode');
  };

  const handleSendingSignInData = (phone: string) => {
    //TODO add logic for send data on back
    if (phone) {
      navigation.navigate('SignInPhoneCode');
    }
  };

  return (
    <SafeAreaView>
      <TitleWithCloseButton
        title={isSignIn ? t('auth_Auth_signInTitle') : t('auth_Auth_signUpTitle')}
        onBackButtonPress={() => navigation.replace('Splash')}
      />
      {isSignIn ? (
        <SignInScreen navigateToSignUp={() => setIsisSignIn(false)} onSubmit={handleSendingSignInData} />
      ) : (
        <SignUpScreen
          ref={signUpRef}
          navigateToSignIn={() => setIsisSignIn(true)}
          navigateToTerms={() => navigation.navigate('Terms')}
          onSubmit={handleSendingSignUpData}
        />
      )}
    </SafeAreaView>
  );
};

export default AuthScreen;
