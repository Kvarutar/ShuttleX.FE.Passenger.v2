import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CodeVerificationScreen, SafeAreaView } from 'shuttlex-integration';

import { calculateLockoutTime, incrementAttempts, setLockoutEndTimestamp } from '../../../core/auth/redux/lockout';
import { selectLockoutAttempts, selectLockoutEndTimestamp } from '../../../core/auth/redux/lockout/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { SignInCodeScreenProps } from './props';

const SignInCodeScreen = ({ navigation, route }: SignInCodeScreenProps): JSX.Element => {
  const { verificationType, data } = route.params;
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const lockoutAttempts = useSelector(selectLockoutAttempts);
  const lockoutEndTimestamp = useSelector(selectLockoutEndTimestamp);

  const [lockOutTime, setLockOutTime] = useState<number>(0);
  const [isIncorrectCode, setIsIncorrectCode] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  const getHeaderText = (type: string) => ({
    firstPart: type === 'phone' ? t('auth_SignInCode_phonePrompt') : t('auth_SignInCode_emailPrompt'),
    secondPart: data,
  });

  //TODO Add logic to send data on backend
  const handleCodeChange = (newCode: string) => {
    setIsIncorrectCode(false);
    if (newCode.length === 4) {
      if (newCode === '4444') {
        navigation.replace('Ride');
      } else {
        setIsIncorrectCode(true);
      }
    }
  };

  //TODO Replace it after add logic from backend
  const handleRequestAgain = () => {
    dispatch(incrementAttempts());

    const newLockoutTime = calculateLockoutTime(lockoutAttempts + 1);
    setLockOutTime(newLockoutTime);

    if (newLockoutTime > 0 && newLockoutTime !== lockoutEndTimestamp) {
      dispatch(setLockoutEndTimestamp(newLockoutTime));
      setIsBlocked(true);
    }
  };

  const { firstPart, secondPart } = getHeaderText(verificationType);

  return (
    <SafeAreaView>
      <CodeVerificationScreen
        headerFirstText={firstPart}
        headerSecondText={secondPart}
        onBackButtonPress={navigation.goBack}
        onAgainButtonPress={handleRequestAgain}
        onCodeChange={handleCodeChange}
        isError={isIncorrectCode}
        isBlocked={isBlocked}
        lockOutTime={lockOutTime}
        lockOutTimeForText={'5'}
        onBannedAgainButtonPress={() => setIsBlocked(false)}
        onSupportButtonPress={() => {
          console.log('TODO: onSupportPress');
        }}
      />
    </SafeAreaView>
  );
};

export default SignInCodeScreen;
