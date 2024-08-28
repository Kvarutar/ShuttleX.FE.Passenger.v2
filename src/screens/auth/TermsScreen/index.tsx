import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  ButtonV1,
  ButtonV1Shapes,
  ScrollViewWithCustomScroll,
  ShortArrowIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { TermsScreenProps } from './props';

const TermsScreen = ({ navigation }: TermsScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
    termsText: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
        <View style={styles.termsHeader}>
          <ButtonV1 onPress={navigation.goBack} shape={ButtonV1Shapes.Circle}>
            <ShortArrowIcon />
          </ButtonV1>

          <Text> {t('auth_Terms_Title')} </Text>
        </View>
        <ScrollViewWithCustomScroll>
          <Text style={[styles.termsText, computedStyles.termsText]}>{t('auth_Terms_firstArticle')}</Text>

          <Text style={[styles.termsTextWithMargin, computedStyles.termsText]}>{t('auth_Terms_secondArticle')}</Text>

          <Text style={[styles.termsTextWithMargin, computedStyles.termsText]}>{t('auth_Terms_thirdArticle')}</Text>

          <Text style={[styles.termsTextWithMargin, computedStyles.termsText]}>{t('auth_Terms_forthArticle')}</Text>
        </ScrollViewWithCustomScroll>
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
  termsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
    marginBottom: 32,
  },
  termsText: {
    fontSize: 14,
  },
  termsTextWithMargin: {
    fontSize: 14,
    marginTop: 20,
  },
});

export default TermsScreen;
