import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CodeVerificationScreen, isLockedError, milSecToTime, SafeAreaView } from 'shuttlex-integration';

import {
  accountSettingsChangeDataErrorSelector,
  accountSettingsVerifyStatusSelector,
  isAccountSettingsVerifyLoadingSelector,
} from '../../../core/menu/redux/accountSettings/selectors';
import {
  changeAccountContactData,
  requestAccountSettingsChangeDataVerificationCode,
  verifyAccountSettingsDataCode,
} from '../../../core/menu/redux/accountSettings/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';

const AccountVerificateCodeScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AccountVerificateCode'>>();
  const { mode, newValue, method } = route.params || {};

  const dispatch = useAppDispatch();
  const [isBlocked, setIsBlocked] = useState(false);

  const [isIncorrectCode, setIsIncorrectCode] = useState<boolean>(false);
  const [lockoutMinutes, setLockoutMinutes] = useState('');
  const [lockoutEndTimestamp, setLockoutEndTimestamp] = useState(0);

  const changeDataError = useSelector(accountSettingsChangeDataErrorSelector);
  const isVerificationLoading = useSelector(isAccountSettingsVerifyLoadingSelector);
  const verifiedStatus = useSelector(accountSettingsVerifyStatusSelector);

  const { t } = useTranslation();

  //TODO change it when back will synchronize profile
  const defineMode = mode === 'email' ? verifiedStatus.emailInfo : verifiedStatus.phoneInfo;

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (newCode.length === 4) {
        if (method === 'change' && newValue) {
          dispatch(verifyAccountSettingsDataCode({ mode, code: newCode, body: newValue }));
        } else if (defineMode) {
          dispatch(verifyAccountSettingsDataCode({ mode, code: newCode, body: defineMode }));
        }
      }
    },
    [dispatch, mode, newValue, method, defineMode],
  );

  useEffect(() => {
    if (!changeDataError && !isVerificationLoading) {
      navigation.goBack();
    }
  }, [changeDataError, navigation, isVerificationLoading]);

  useEffect(() => {
    if (changeDataError) {
      setIsIncorrectCode(true);
      if (isLockedError(changeDataError)) {
        setIsIncorrectCode(true);
        const lockoutEndDate = new Date(changeDataError.body.lockOutEndTime).getTime() - Date.now();

        setLockoutMinutes(Math.round(milSecToTime(lockoutEndDate)).toString());
        setLockoutEndTimestamp(lockoutEndDate);
        setIsBlocked(true);
      }
    } else {
      setIsIncorrectCode(false);
    }
  }, [changeDataError, method]);

  const handleRequestAgain = () => {
    if (method === 'change' && newValue && defineMode) {
      dispatch(changeAccountContactData({ mode, data: { oldData: defineMode, newData: newValue } }));
    } else if (defineMode) {
      dispatch(requestAccountSettingsChangeDataVerificationCode({ mode, data: defineMode }));
    }
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
