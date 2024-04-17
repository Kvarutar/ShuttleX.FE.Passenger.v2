import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { GroupedButtons, SafeAreaView } from 'shuttlex-integration';
import { GroupedButtonsProps } from 'shuttlex-integration/lib/typescript/src/shared/molecules/GroupedButtons/props';

import { AuthScreenProps } from './props';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthScreen = ({ navigation, route }: AuthScreenProps): JSX.Element => {
  const [isFirstButtonSelected, setIsFirstButtonSelected] = useState<GroupedButtonsProps['isFirstButtonSelected']>(
    route.params.state === 'SignUp',
  );

  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <GroupedButtons
        width={270}
        style={styles.groupedButtons}
        firstButtonText={t('auth_Auth_GroupedButton_firstButton')}
        secondButtonText={t('auth_Auth_GroupedButton_secondButton')}
        isFirstButtonSelected={isFirstButtonSelected}
        setIsFirstButtonSelected={setIsFirstButtonSelected}
      />
      {isFirstButtonSelected ? (
        <SignUp onPress={() => setIsFirstButtonSelected(false)} navigation={navigation} />
      ) : (
        <SignIn onPress={() => setIsFirstButtonSelected(true)} navigation={navigation} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  groupedButtons: {
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
});

export default AuthScreen;
