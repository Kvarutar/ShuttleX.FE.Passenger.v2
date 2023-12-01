import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, PhoneInput, Text, useTheme } from 'shuttlex-integration';

import { AuthProps } from './props';

const SignIn = ({ onPress }: AuthProps): JSX.Element => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    signUpLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <>
      <View style={styles.phoneNumberContainer}>
        <Text style={styles.title}>Enter your phone number{'\n'}to recieve code</Text>
        <PhoneInput />
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Button text="Next" />
        <Pressable style={styles.dontHaveAccountContainer} onPress={onPress} hitSlop={20}>
          {/* //TODO: Adjust after implementing https://www.notion.so/shuttlex/i18n-install-library-to-support-i18n-77e236ccfc344d67b9d370e400d45557 */}
          <Text style={styles.dontHaveAccountText}>
            Don’t have an account? <Text style={computedStyles.signUpLabel}>Sign up</Text>
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  phoneNumberContainer: {
    flex: 1,
    gap: 30,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter Medium',
  },
  bottomButtonsContainer: {
    gap: 32,
  },
  dontHaveAccountContainer: {
    alignSelf: 'center',
  },
  dontHaveAccountText: {
    fontFamily: 'Inter Medium',
  },
});

export default SignIn;
