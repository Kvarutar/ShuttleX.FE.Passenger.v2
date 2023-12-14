import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { GroupedButtons, sizes, useTheme } from 'shuttlex-integration';
import { GroupedButtonsProps } from 'shuttlex-integration/lib/typescript/src/shared/Widgets/GroupedButtons/props';

import { AuthScreenProps } from './props';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthScreen = ({ route }: AuthScreenProps): JSX.Element => {
  const [isFirstSelectedButton, setIsFirstSelectedButton] = useState<GroupedButtonsProps['isFirstSelectedButton']>(
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
    <View style={[styles.container, computedStyles.container]}>
      <GroupedButtons
        style={styles.groupedButtons}
        firstTextButton={t('auth_Auth_GroupedButton_firstButton')}
        secondTextButton={t('auth_Auth_GroupedButton_secondButton')}
        isFirstSelectedButton={isFirstSelectedButton}
        setIsFirstSelectedButton={setIsFirstSelectedButton}
      />
      {isFirstSelectedButton ? (
        <SignUp onPress={() => setIsFirstSelectedButton(false)} />
      ) : (
        <SignIn onPress={() => setIsFirstSelectedButton(true)} />
      )}
    </View>
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
