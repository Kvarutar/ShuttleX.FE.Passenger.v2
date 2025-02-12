import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'shuttlex-integration';

import aipopup from '../../../../../../../assets/images/aipopup';

const FourthCard = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    tag: {
      backgroundColor: colors.backgroundTertiaryColor,
    },
    tagText: {
      color: colors.textTertiaryColor,
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.firstTag, styles.tag, computedStyles.tag]}>
        <Text style={[styles.tagText, computedStyles.tagText]}>{t('ride_AiPopup_fourthCard_tagText')}</Text>
      </View>

      <View style={styles.imageWrapper}>
        <Image source={aipopup.fourthCardImage} style={styles.image} />
      </View>
      <View style={[styles.secondTag, styles.tag, computedStyles.tag]}>
        <Text style={[styles.tagText, computedStyles.tagText]}>{t('ride_AiPopup_fourthCard_secondTagText')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
  },
  tag: {
    alignItems: 'center',
    opacity: 0.8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    position: 'absolute',
    zIndex: 2,
    alignContent: 'center',
  },
  firstTag: {
    right: '-10%',
    borderTopStartRadius: 10,
    borderBottomEndRadius: 10,
    borderTopEndRadius: 10,
  },
  secondTag: {
    bottom: 0,
    maxWidth: 90,
    borderTopStartRadius: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },

  tagText: {
    fontSize: 11,
    fontFamily: 'Inter Medium',
  },
  imageWrapper: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 100,
  },
});

export default FourthCard;
