import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { CodeVerificationScreen, isLockedError, milSecToTime, SafeAreaView } from 'shuttlex-integration';

import { isCantDeleteAccountWhileInDebtError } from '../../../core/menu/redux/accountSettings/errors';
import {
  accountSettingsChangeDataErrorSelector,
  accountSettingsVerifyErrorSelector,
  accountSettingsVerifyStatusSelector,
  deleteAccountErrorSelector,
  isAccountSettingsVerifyLoadingSelector,
} from '../../../core/menu/redux/accountSettings/selectors';
import {
  changeAccountContactData,
  deleteAccountRequest,
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
  const verifyDataError = useSelector(accountSettingsVerifyErrorSelector);

  const deleteAccountError = useSelector(deleteAccountErrorSelector);
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
    if (!changeDataError && !verifyDataError && !isVerificationLoading) {
      if (method === 'delete') {
        dispatch(deleteAccountRequest());
      } else {
        navigation.goBack();
      }
    }
  }, [dispatch, changeDataError, navigation, method, isVerificationLoading, verifyDataError]);

  useEffect(() => {
    if (deleteAccountError) {
      Alert.alert(
        t('menu_AccountVerificateCode_deleteAccountErrorAlertTitle'),
        t(
          isCantDeleteAccountWhileInDebtError(deleteAccountError)
            ? 'menu_AccountVerificateCode_deleteAccountErrorAlertDescriptionDebt'
            : 'menu_AccountVerificateCode_deleteAccountErrorAlertDescriptionInvalidState',
        ),
      );
      navigation.goBack();
    }
  }, [t, navigation, deleteAccountError]);

  useEffect(() => {
    setIsIncorrectCode(Boolean(changeDataError || verifyDataError));

    if (changeDataError) {
      if (isLockedError(changeDataError)) {
        setIsIncorrectCode(true);
        const lockoutEndDate = Date.parse(changeDataError.body.lockOutEndTime) - Date.now();

        setLockoutMinutes(Math.round(milSecToTime(lockoutEndDate)).toString());
        setLockoutEndTimestamp(lockoutEndDate);
        setIsBlocked(true);
      }
    }
  }, [changeDataError, verifyDataError]);

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
        headerFirstText={t(
          mode === 'email' ? 'menu_AccountVerificateCode_emailPrompt' : 'menu_AccountVerificateCode_phonePrompt',
        )}
        headerSecondText={defineMode}
        onBackButtonPress={navigation.goBack}
        onAgainButtonPress={handleRequestAgain}
        onCodeChange={handleCodeChange}
        titleText={t('menu_AccountVerificateCode_change')}
        isBlocked={isBlocked}
        isError={isIncorrectCode}
        lockOutTime={lockoutEndTimestamp}
        lockOutTimeForText={lockoutMinutes}
        onBannedAgainButtonPress={onBannedAgainPress}
        onSupportButtonPress={() => Linking.openURL('https://t.me/ShuttleX_Support')}
      />
    </SafeAreaView>
  );
};

export default AccountVerificateCodeScreen;
