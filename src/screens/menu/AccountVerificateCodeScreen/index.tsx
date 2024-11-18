import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CodeVerificationScreen, isLockedError, milSecToTime, SafeAreaView } from 'shuttlex-integration';

import { setIsAccountSettingsVerificationDone } from '../../../core/menu/redux/accountSettings';
import {
  accountSettingsErrorSelector,
  isAccountSettingsLoadingSelector,
} from '../../../core/menu/redux/accountSettings/selectors';
import { changeAccountContactData, verifyChangeAccountDataCode } from '../../../core/menu/redux/accountSettings/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { profileSelector } from '../../../core/redux/passenger/selectors';
import { RootStackParamList } from '../../../Navigate/props';

const AccountVerificateCodeScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AccountVerificateCode'>>();
  const { mode, newValue } = route.params;

  const dispatch = useAppDispatch();
  const [isBlocked, setIsBlocked] = useState(false);

  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [isIncorrectCode, setIsIncorrectCode] = useState<boolean>(false);
  const [lockoutMinutes, setLockoutMinutes] = useState('');
  const [lockoutEndTimestamp, setLockoutEndTimestamp] = useState(0);

  const profile = useSelector(profileSelector);
  const changeDataError = useSelector(accountSettingsErrorSelector);
  const isLoading = useSelector(isAccountSettingsLoadingSelector);

  const { t } = useTranslation();

  const handleCodeChange = async (newCode: string) => {
    //TODO: fix inputs: this function triggers when error state changes
    if (!changeDataError) {
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
      dispatch(verifyChangeAccountDataCode({ method: mode, code: verificationCode, body: newValue })); //TODO: move logic to handle code change after bug with wron function trigger will be solved
    }
  }, [verificationCode, mode, newValue, dispatch]);

  useEffect(() => {
    if (!isLoading && !changeDataError) {
      dispatch(setIsAccountSettingsVerificationDone(true));
      navigation.goBack();
    }

    if (changeDataError) {
      setIsIncorrectCode(true);
      if (isLockedError(changeDataError)) {
        setIsIncorrectCode(true);
        const lockoutEndDate = new Date(changeDataError.body.lockOutEndTime).getTime() - Date.now();

        setLockoutMinutes(Math.round(milSecToTime(lockoutEndDate)).toString());
        setLockoutEndTimestamp(lockoutEndDate);
        setIsBlocked(true);
      }
    }
  }, [changeDataError, navigation, isLoading, dispatch]);

  const isOldData = mode === 'phone' ? profile?.phone : profile?.email;

  const handleRequestAgain = () => {
    dispatch(changeAccountContactData({ method: mode, data: { oldData: isOldData ?? '', newData: newValue } }));
  };

  const onBannedAgainPress = () => {
    handleRequestAgain();
    setIsBlocked(false);
  };

  return (
    <SafeAreaView>
      <CodeVerificationScreen
        headerFirstText={t('menu_AccountVerificateCode_firstHeader')}
        headerSecondText={t('menu_AccountVerificateCode_secondHeader')}
        onBackButtonPress={navigation.goBack}
        onAgainButtonPress={handleRequestAgain}
        onCodeChange={handleCodeChange}
        titleText={t('menu_AccountVerificateCode_change')}
        isBlocked={isBlocked}
        isError={isIncorrectCode}
        lockOutTime={lockoutEndTimestamp}
        lockOutTimeForText={lockoutMinutes}
        onBannedAgainButtonPress={onBannedAgainPress}
        onSupportButtonPress={() => {
          // TODO: onSupportPress
        }}
      />
    </SafeAreaView>
  );
};

export default AccountVerificateCodeScreen;
