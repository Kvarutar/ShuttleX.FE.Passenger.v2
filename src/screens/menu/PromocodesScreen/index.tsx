import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { MenuHeader, sizes, Text, TextInput, TextInputInputMode, useTheme } from 'shuttlex-integration';

import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';

const windowSizes = Dimensions.get('window');
const isPhoneSmall = windowSizes.height < 700;

const PromocodesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    primaryGreenBackground: {
      backgroundColor: colors.primaryColor,
      height: windowSizes.height * 0.42,
    },
    youTurnText: {
      color: colors.textSecondaryColor,
    },
    promocodeDescription: {
      color: colors.textPrimaryColor,
    },
    contentContainer: {
      top: windowSizes.height * (isPhoneSmall ? 0.12 : 0.18),
    },
    enterCodeBlock: {
      backgroundColor: colors.outlineColor,
    },
    safeArea: {
      height: windowSizes.height,
    },
  });
  return (
    <SafeAreaView style={[styles.safeArea, computedStyles.safeArea]}>
      <View style={styles.menuHeader}>
        <MenuHeader
          onMenuPress={() => setIsMenuVisible(true)}
          onNotificationPress={() => navigation.navigate('Notifications')}
        >
          <Text>{t('ride_Menu_navigationPromocodes')}</Text>
        </MenuHeader>
      </View>
      <View style={[styles.primaryGreenBackground, computedStyles.primaryGreenBackground, StyleSheet.absoluteFill]}>
        <View style={styles.wrapper}>
          <View style={[styles.contentContainer, computedStyles.contentContainer]}>
            <TextInput
              value="488-384"
              //TODO pass the dynamic promocode
              inputMode={TextInputInputMode.Text}
              inputStyle={styles.promocodeNumber}
              containerStyle={styles.inputCode}
            />
            <View style={styles.promocodeTexts}>
              <Text style={styles.promocodeText}>{t('menu_Promocodes_offer')}</Text>
              <Text style={[styles.promocodeDescription, computedStyles.promocodeDescription]}>
                {t('menu_Promocodes_descript')}
              </Text>
            </View>
            <View style={[styles.enterCodeBlock, computedStyles.enterCodeBlock]}>
              <View style={styles.enterCodeTexts}>
                <Text style={[styles.youTurnText, computedStyles.youTurnText]}>{t('menu_Promocodes_youTurn')}</Text>
                <Text style={styles.enterCodeText}>{t('menu_Promocodes_enterCode')}</Text>
              </View>
              <TextInput inputMode={TextInputInputMode.Decimal} onlyDigits placeholder={t('menu_Promocodes_input')} />
            </View>
          </View>
        </View>
      </View>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'relative',
  },
  menuHeader: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
  wrapper: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
  primaryGreenBackground: {
    zIndex: -1,
  },
  contentContainer: {
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  promocodeNumber: {
    fontSize: 62,
    fontFamily: 'Inter Medium',
    textAlign: 'center',
  },
  promocodeText: {
    fontSize: 17,
    fontFamily: 'Inter Bold',
    textAlign: 'center',
    lineHeight: 20.57,
  },

  promocodeDescription: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.43,
  },
  promocodeTexts: {
    gap: 10,
    marginTop: 33,
  },
  enterCodeBlock: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 21,
    marginTop: 19,
    borderRadius: 12,
    gap: 63,
    alignSelf: 'stretch',
  },
  youTurnText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
  },
  enterCodeText: {
    fontSize: 21,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  enterCodeTexts: {
    gap: 4,
  },
  inputCode: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
  },
});
export default PromocodesScreen;
