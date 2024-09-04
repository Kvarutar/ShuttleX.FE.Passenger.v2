import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { GroupedBrandIcon, SafeAreaView, Text, useThemeV1 } from 'shuttlex-integration';

import { SplashScreenProps } from './props';

const SplashScreen = ({ navigation }: SplashScreenProps): JSX.Element => {
  const { colors } = useThemeV1();
  const { t } = useTranslation();

  const navigationToSignIn = () => navigation.replace('Auth', { state: 'SignIn' });

  return (
    <SafeAreaView>
      <GroupedBrandIcon style={styles.groupedBrandIconContainer} iconColor={colors.primaryColor} />
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.alreadyHaveAccountContainer} onPress={navigationToSignIn} hitSlop={20}>
          <Text style={styles.alreadyHaveAccountText}>{t('auth_Splash_haveAccount')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  groupedBrandIconContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonsContainer: {
    gap: 28,
  },
  alreadyHaveAccountContainer: {
    alignSelf: 'center',
  },
  alreadyHaveAccountText: {
    fontFamily: 'Inter Medium',
  },
});

export default SplashScreen;
