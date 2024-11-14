import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CodeVerificationScreen, milSecToTime } from 'shuttlex-integration';

import { isLockedError } from '../../../core/auth/redux/errors/errors';
import { authErrorSelector, isAuthLoadingSelector, isLoggedInSelector } from '../../../core/auth/redux/selectors';
import { signIn, verifyCode } from '../../../core/auth/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { SignInCodeScreenProps } from './props';

const SignInCodeScreen = ({ navigation, route }: SignInCodeScreenProps): JSX.Element => {
  const { data, verificationType } = route.params;
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const isLoading = useSelector(isAuthLoadingSelector);
  const isLoggedIn = useSelector(isLoggedInSelector);
  const signError = useSelector(authErrorSelector);

  const [isIncorrectCode, setIsIncorrectCode] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [lockoutEndTimestamp, setLockoutEndTimestamp] = useState(0);

  const [lockoutMinutes, setLockoutMinutes] = useState('');

  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const getHeaderText = (type: string) => ({
    firstPart: type === 'phone' ? t('auth_SignInCode_phonePrompt') : t('auth_SignInCode_emailPrompt'),
    secondPart: data,
  });

  const handleCodeChange = async (newCode: string) => {
    //TODO: fix inputs: this function triggers when error state changes
    if (!signError) {
      setIsIncorrectCode(false);
    }

    if (newCode.length === 4) {
      setVerificationCode(newCode);
    } else {
      setVerificationCode(null);
    }
  };

  useEffect(() => {
    if (verificationCode) {
      dispatch(verifyCode({ method: verificationType, code: verificationCode, body: data })); //TODO: move logic to handle code change after bug with wron function trigger will be solved
    }
  }, [verificationCode, data, dispatch, verificationType]);

  useEffect(() => {
    if (isLoggedIn && !isLoading && !signError) {
      navigation.replace('Ride');
    }

    if (signError) {
      setIsIncorrectCode(true);
      if (isLockedError(signError)) {
        setIsIncorrectCode(true);
        const lockoutEndDate = new Date(signError.body.lockOutEndTime).getTime() - Date.now();

        setLockoutMinutes(Math.round(milSecToTime(lockoutEndDate)).toString());
        setLockoutEndTimestamp(lockoutEndDate);
        setIsBlocked(true);
      }
    }
  }, [isLoggedIn, isLoading, signError, navigation, dispatch]);

  const handleRequestAgain = () => {
    dispatch(signIn({ method: verificationType, data }));
  };

  const onBannedAgainPress = () => {
    handleRequestAgain();
    setIsBlocked(false);
  };

  const { firstPart, secondPart } = getHeaderText(verificationType);

  return (
    <CodeVerificationScreen
      headerFirstText={firstPart}
      headerSecondText={secondPart}
      onBackButtonPress={navigation.goBack}
      onAgainButtonPress={handleRequestAgain}
      onCodeChange={handleCodeChange}
      isError={isIncorrectCode}
      isBlocked={isBlocked}
      lockOutTime={lockoutEndTimestamp}
      lockOutTimeForText={lockoutMinutes}
      onBannedAgainButtonPress={onBannedAgainPress}
      onSupportButtonPress={() => {
        console.log('TODO: onSupportPress'); //TODO: add function
      }}
    />
  );
};

export default SignInCodeScreen;
