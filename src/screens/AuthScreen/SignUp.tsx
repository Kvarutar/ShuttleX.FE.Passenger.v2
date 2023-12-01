import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, DatePicker, PhoneInput, Text, TextInput, useTheme } from 'shuttlex-integration';

import { AuthProps } from './props';

const SignUp = ({ onPress }: AuthProps): JSX.Element => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    signInLabel: {
      color: colors.primaryColor,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput placeholder="Name" />
      <TextInput placeholder="Last name" />
      <DatePicker />
      <TextInput placeholder="Email" />
      <PhoneInput />
      <TextInput placeholder="City" />
      <TextInput placeholder="Promocode" />

      <View style={styles.buttonsContainer}>
        <Button text="Create an account" />
        <Pressable style={styles.alreadyHaveAccountContainer} onPress={onPress} hitSlop={20}>
          <Text style={styles.alreadyHaveAccountText}>
            Already have an account? <Text style={computedStyles.signInLabel}>Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
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
});

export default SignUp;
