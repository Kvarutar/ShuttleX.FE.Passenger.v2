import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, GroupedButtons, PhoneInput, sizes, Text, useTheme } from 'shuttlex-integration';
import { GroupedButtonsProps } from 'shuttlex-integration/lib/typescript/src/shared/Widgets/GroupedButtons/props';

import { SignInScreenProps } from './props';

const SignInScreen = ({}: SignInScreenProps): JSX.Element => {
  const [selectedGroupedButton, setSelectedGroupedButton] =
    useState<GroupedButtonsProps['isFirstSelectedButton']>(true);

  const { colors } = useTheme();

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
        firstTextButton="Sign In"
        {/* // TODO: Adjust after implementing https://www.notion.so/shuttlex/i18n-install-library-to-support-i18n-77e236ccfc344d67b9d370e400d45557 */}
        secondTextButton="Sign Up"
        {/* // TODO: Adjust after implementing https://www.notion.so/shuttlex/i18n-install-library-to-support-i18n-77e236ccfc344d67b9d370e400d45557 */}
        isFirstSelectedButton={selectedGroupedButton}
        setIsFirstSelectedButton={setSelectedGroupedButton}
      />

      <View style={styles.phoneNumberContainer}>
        <Text style={styles.signInTitle}>Enter your phone number {'\n'}to recieve code</Text>
        <PhoneInput />
      </View>

      <View style={styles.buttonsContainer}>
        <Button text="Next" />
        <Pressable style={styles.alreadyHaveAccountContainer} onPress={() => {}} hitSlop={20}>
          {/* // TODO: Adjust after implementing https://www.notion.so/shuttlex/i18n-install-library-to-support-i18n-77e236ccfc344d67b9d370e400d45557 */}
          <Text style={styles.alreadyHaveAccountText}>
            Don’t have an account? <Text style={computedStyles.signUpLabel}>Sign up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
  },
  buttonsContainer: {
    gap: 32,
  },
  alreadyHaveAccountContainer: {
    alignSelf: 'center',
  },
  alreadyHaveAccountText: {
    fontFamily: 'Inter Medium',
  },
  groupedButtons: {
    alignSelf: 'flex-end',
  },
  signInTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter Medium',
  },
  phoneNumberContainer: {
    flex: 1,
    gap: 30,
    marginTop: 60,
  },
});

export default SignInScreen;
