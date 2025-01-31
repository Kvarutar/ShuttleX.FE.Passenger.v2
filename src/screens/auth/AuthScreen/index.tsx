import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useSelector } from 'react-redux';
import {
  CustomKeyboardAvoidingView,
  isIncorrectFieldsError,
  isLockedError,
  KeyboardAvoidingViewMode,
  milSecToTime,
  SafeAreaView,
  SignInMethod,
  SignInScreen,
  SignUpForm,
  SignUpScreen,
  SignUpScreenRef,
  TemporaryLockoutPopup,
  TitleWithCloseButton,
} from 'shuttlex-integration';

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
  const previousSignMethodRef = useRef<SignInMethod>(SignInMethod.Phone);

  const [isSignIn, setIsisSignIn] = useState<boolean>(route.params.state === 'SignIn');
  const [data, setData] = useState<string | null>();
  const [signMethod, setSignMethod] = useState<SignInMethod>(SignInMethod.Phone);
  const [lockoutMinutes, setLockoutMinutes] = useState('');

  useEffect(() => {
    if (!isLoading && !signError && data && previousSignMethodRef.current === signMethod) {
      navigation.navigate('SignInCode', { verificationType: signMethod, data });
    }

    previousSignMethodRef.current = signMethod;

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

  useEffect(() => {
    if (signError && isLockedError(signError)) {
      const lockoutEndDate = new Date(signError.body.lockOutEndTime).getTime() - Date.now();
      setLockoutMinutes(Math.round(milSecToTime(lockoutEndDate)).toString());
    } else {
      setLockoutMinutes('');
    }
  }, [signError]);

  const handleSendingSignUpData = (dataForm: SignUpForm) => {
    setData(dataForm.phone);
    dispatch(
      signUp({
        email: dataForm.email,
        firstName: dataForm.firstName,
        phone: dataForm.phone,
        method: 'phone',
      }),
    );
  };

  const handleSendingSignInData = (body: string) => {
    setData(body.trim());
    dispatch(signIn({ method: signMethod, data: body }));
  };

  const [isPanelPhoneSelectVisible, setIsPanelPhoneSelectVisible] = useState<boolean>(false);
  const [keyboardMode, setKeyboardMode] = useState<KeyboardAvoidingViewMode>('normal');

  useEffect(() => {
    setKeyboardMode(isPanelPhoneSelectVisible ? 'inverted' : 'normal');
  }, [isPanelPhoneSelectVisible]);

  return (
    <CustomKeyboardAvoidingView mode={keyboardMode}>
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
            setPanelPhoneVisible={setIsPanelPhoneSelectVisible}
          />
        ) : (
          <SignUpScreen
            ref={signUpRef}
            navigateToSignIn={() => setIsisSignIn(true)}
            navigateToTerms={() => Linking.openURL('https://www.shuttlex.com/privacy.html')}
            onSubmit={handleSendingSignUpData}
            isLoading={isLoading}
            setPanelPhoneVisible={setIsPanelPhoneSelectVisible}
          />
        )}
      </SafeAreaView>
      {isSignIn && lockoutMinutes !== '' && (
        <TemporaryLockoutPopup
          lockOutTimeText={lockoutMinutes}
          onSupportButtonPress={() => Linking.openURL('https://t.me/ShuttleX_Support')}
        />
      )}
    </CustomKeyboardAvoidingView>
  );
};

export default AuthScreen;
