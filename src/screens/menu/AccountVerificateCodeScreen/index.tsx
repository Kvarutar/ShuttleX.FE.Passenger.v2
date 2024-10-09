import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { CodeVerificationScreen, minToMilSec, SafeAreaView } from 'shuttlex-integration';

import { setIsVerificationDone } from '../../../core/menu/redux/accountSettings';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';

const AccountVerificateCodeScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const [isCorrectCode, setIsCorrectCode] = useState<boolean>(false);
  const { t } = useTranslation();

  //TODO Add logic to send data on backend
  const handleCodeChange = (newCode: string) => {
    setIsCorrectCode(false);
    if (newCode.length === 4) {
      if (newCode === '4444') {
        setIsCorrectCode(true);
      } else {
        dispatch(setIsVerificationDone(true));
        navigation.goBack();
      }
    }
  };

  const onRequestAgain = () => {
    //TODO Request code again
  };

  return (
    <SafeAreaView containerStyle={styles.wrapper}>
      <CodeVerificationScreen
        headerFirstText={t('ride_Menu_Verification_firstHeader')}
        headerSecondText={t('ride_Menu_Verification_secondHeader')}
        onBackButtonPress={onRequestAgain}
        onAgainButtonPress={onRequestAgain}
        onCodeChange={handleCodeChange}
        titleText={t('ride_Menu_Verification_change')}
        isBlocked={false}
        isError={isCorrectCode}
        lockOutTime={minToMilSec(3)}
        lockOutTimeForText={'3'}
        onBannedAgainButtonPress={() => {
          // TODO: onSupportPress
        }}
        onSupportButtonPress={() => {
          // TODO: onSupportPress
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 24,
  },
});
export default AccountVerificateCodeScreen;
