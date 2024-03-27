import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { GroupedButtons, sizes, useTheme } from 'shuttlex-integration';
import { GroupedButtonsProps } from 'shuttlex-integration/lib/typescript/src/shared/molecules/GroupedButtons/props';

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
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    signUpLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
  },
  groupedButtons: {
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
});

export default AuthScreen;
