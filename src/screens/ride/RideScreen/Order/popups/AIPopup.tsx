import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  Button,
  ButtonShapes,
  CameraIcon,
  CircleButtonModes,
  ScrollViewWithCustomScroll,
  Text,
  useTheme,
} from 'shuttlex-integration';

import aipopup from '../../../../../../assets/images/aipopup';
import { profilePrefferedNameSelector } from '../../../../../core/passenger/redux/selectors';

const imageArray = [aipopup.firstCard, aipopup.secondCard];
const imageArray2 = [aipopup.thirdCard, aipopup.fourthCard];

const AIPopup = () => {
  const prefferedName = useSelector(profilePrefferedNameSelector);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    header: {
      color: colors.textQuadraticColor,
    },
    descript: {
      color: colors.textQuadraticColor,
    },
    firstCardTitle: {
      color: colors.textQuadraticColor,
    },
    secondCardTitle: {
      color: colors.textPrimaryColor,
    },
  });
  return (
    <ScrollViewWithCustomScroll contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.textContainer}>
          <Text style={[styles.header, computedStyles.header]}>{t('ride_AiPopup_header')}</Text>
          <Text style={styles.greeting}>{t('ride_AiPopup_greeting', { name: prefferedName })}</Text>
          <Text style={[styles.descript, computedStyles.descript]}>{t('ride_AiPopup_description')}</Text>
        </View>
        <View style={styles.photoContainer}>
          <View style={styles.imageContainer}>
            {imageArray.map(i => (
              <View style={styles.imageWrapper}>
                <Image source={i} style={styles.image} />
              </View>
            ))}
          </View>
          <View style={styles.imageContainer}>
            {imageArray2.map(i => (
              <View style={styles.imageWrapper}>
                <Image source={i} style={styles.image} />
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.barWrapper}>
        <Bar style={styles.barContainer}>
          <Image source={aipopup.TrueTypeIcon} />
          <Text style={styles.searchBarText}>{t('ride_AiPopup_searchBar')}</Text>
        </Bar>
        <Button mode={CircleButtonModes.Mode4} shape={ButtonShapes.Circle}>
          <CameraIcon style={styles.cameraIconStyle} />
        </Button>
        <Button mode={CircleButtonModes.Mode4} shape={ButtonShapes.Circle}>
          <Image source={aipopup.voiceImage} />
        </Button>
      </View>
    </ScrollViewWithCustomScroll>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    gap: 6,
    alignItems: 'center',
  },
  bottomWindowStyle: {
    backgroundColor: '#F7F6F7',
    flex: 1,
  },
  container: {
    paddingTop: 20,
    justifyContent: 'space-between',
    backgroundColor: '#F7F6F7',
    flex: 1,
    alignItems: 'center',
  },
  wrapper: {
    gap: 15,
  },
  textContainer: {
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 60,
  },

  imageContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  imageWrapper: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 20,
  },
  image: {
    height: 'auto',
    width: 190,
    aspectRatio: 1,
  },
  header: {
    fontSize: 18,
    fontFamily: 'Inter Bold',
    lineHeight: 32,
  },
  greeting: {
    fontSize: 40,
    fontFamily: 'Inter Bold',
    lineHeight: 42,
  },
  descript: {
    fontSize: 22,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
    textAlign: 'center',
    paddingTop: 6,
  },
  firstCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter Bold',
    lineHeight: 42,
    letterSpacing: 0,
  },
  secondCardTitle: {
    fontSize: 18,
    fontFamily: 'Inter Bold',
    lineHeight: 20,
    letterSpacing: 0,
  },
  barWrapper: {
    flexDirection: 'row',
    gap: 5,
  },
  barContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 50,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#F7F6F7',
  },
  searchBarText: {
    fontSize: 14,
    fontFamily: 'Inter Medium',
  },
  cameraIconStyle: {
    width: 23,
    height: 24,
  },
});

export default AIPopup;
