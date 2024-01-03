import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GroupedButtons, sizes, useTheme } from 'shuttlex-integration';
import { GroupedButtonsProps } from 'shuttlex-integration/lib/typescript/src/shared/Widgets/GroupedButtons/props';

import { AuthScreenProps } from './props';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthScreen = ({ navigation, route }: AuthScreenProps): JSX.Element => {
  const [isFirstButtonSelected, setIsFirstButtonSelected] = useState<GroupedButtonsProps['isFirstButtonSelected']>(
    route.params.state === 'SignUp',
  );

  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    signUpLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <SafeAreaView style={[styles.container, computedStyles.container]}>
      <GroupedButtons
        style={styles.groupedButtons}
        firstTextButton={t('auth_Auth_GroupedButton_firstButton')}
        secondTextButton={t('auth_Auth_GroupedButton_secondButton')}
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
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
  },
  groupedButtons: {
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
});

export default AuthScreen;
