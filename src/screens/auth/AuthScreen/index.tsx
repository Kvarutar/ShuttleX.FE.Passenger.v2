import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  CustomKeyboardAvoidingView,
  SafeAreaView,
  SignInMethod,
  SignInScreen,
  SignUpForm,
  SignUpScreen,
  SignUpScreenRef,
  TitleWithCloseButton,
} from 'shuttlex-integration';

import { isIncorrectFieldsError } from '../../../core/auth/redux/errors/errors';
import { authErrorSelector, isAuthLoadingSelector } from '../../../core/auth/redux/selectors';
import { signIn, signUp } from '../../../core/auth/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { AuthScreenProps } from './props';

const AuthScreen = ({ navigation, route }: AuthScreenProps): JSX.Element => {
  const signUpRef = useRef<SignUpScreenRef>(null);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useSelector(isAuthLoadingSelector);
  const signError = useSelector(authErrorSelector);

  const [isSignIn, setIsisSignIn] = useState<boolean>(route.params.state === 'SignIn');
  const [data, setData] = useState<string | null>();
  const [signMethod, setSignMethod] = useState<SignInMethod>(SignInMethod.Phone);

  useEffect(() => {
    if (!isLoading && !signError && data) {
      navigation.navigate('SignInCode', { verificationType: signMethod, data });
    }

    if (signError && isIncorrectFieldsError(signError)) {
      if (Array.isArray(signError.body)) {
        signError.body.forEach(item => {
          signUpRef.current?.showErrors({ [item.field]: item.message });
        });
      } else {
        signUpRef.current?.showErrors({ email: signError.body.message });
      }
    }
  }, [isLoading, signError, navigation, data, signMethod]);

  const handleSendingSignUpData = (dataForm: SignUpForm) => {
    setData(dataForm.phone);
    dispatch(signUp({ email: dataForm.email, firstName: dataForm.firstName, phone: dataForm.phone, method: 'phone' }));
  };

  const handleSendingSignInData = (body: string) => {
    setData(body);
    dispatch(signIn({ method: signMethod, data: body }));
  };

  return (
    <CustomKeyboardAvoidingView>
      <SafeAreaView>
        <TitleWithCloseButton
          title={isSignIn ? t('auth_Auth_signInTitle') : t('auth_Auth_signUpTitle')}
          onBackButtonPress={() => navigation.replace('Splash')}
        />
        {isSignIn ? (
          <SignInScreen
            navigateToSignUp={() => setIsisSignIn(false)}
            onSubmit={handleSendingSignInData}
            isLoading={isLoading}
            signMethod={signMethod}
            setSignMethod={setSignMethod}
          />
        ) : (
          <SignUpScreen
            ref={signUpRef}
            navigateToSignIn={() => setIsisSignIn(true)}
            navigateToTerms={() => navigation.navigate('Terms')}
            onSubmit={handleSendingSignUpData}
            isLoading={isLoading}
          />
        )}
      </SafeAreaView>
    </CustomKeyboardAvoidingView>
  );
};

export default AuthScreen;
