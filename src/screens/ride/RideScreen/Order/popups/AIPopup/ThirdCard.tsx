import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'shuttlex-integration';

import aipopup from '../../../../../../../assets/images/aipopup';

const ThirdCard = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    secondTagText: {
      color: colors.textTertiaryColor,
    },
  });

  return (
    <View>
      <View style={styles.firstTag}>
        <Image source={aipopup.starIcon} style={styles.image} />
        <Text style={styles.firstTagText}>{t('ride_AiPopup_thirdCard_tagText')}</Text>
      </View>
      <View style={styles.userPhotoWrapper}>
        <Image source={aipopup.thirdCardUser} style={[styles.imageStyle, styles.userPhoto]} />
      </View>
      <View style={styles.mainImageWrapper}>
        <Image source={aipopup.thirdCardImage} style={[styles.imageStyle, styles.mainImage]} />
      </View>
      <View style={styles.secondTag}>
        <Text style={[styles.secondTagText, computedStyles.secondTagText]}>
          {t('ride_AiPopup_thirdCard_secondTagText')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  firstTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6E6E6',
    opacity: 0.9,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderTopEndRadius: 10,
    position: 'absolute',
    zIndex: 2,
    alignContent: 'center',
    top: '30%',
    right: '-10%',
  },
  secondTag: {
    alignItems: 'center',
    backgroundColor: '#B0C1D1',
    opacity: 0.9,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderTopStartRadius: 10,
    position: 'absolute',
    maxWidth: 90,
    zIndex: 2,
    alignContent: 'center',
    bottom: 0,
    left: '-10%',
  },
  image: {
    width: 12,
    height: 12,
  },
  firstTagText: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
  },
  secondTagText: {
    fontSize: 11,
    fontFamily: 'Inter Medium',
  },
  userPhotoWrapper: {
    width: '12%',
    aspectRatio: 1,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
    top: '15%',
    right: '15%',
    position: 'absolute',
    zIndex: 2,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userPhoto: {
    borderRadius: 100,
  },
  mainImage: {
    borderRadius: 10,
  },
  mainImageWrapper: {
    width: '70%',
    aspectRatio: 0.8,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
    top: '10%',
  },
});

export default ThirdCard;
