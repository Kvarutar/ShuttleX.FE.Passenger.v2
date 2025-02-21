import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bar,
  BarModes,
  BottomWindow,
  Button,
  ButtonShapes,
  ButtonSizes,
  ChatIcon2,
  InputXIcon,
  LocationIcon,
  NoteIcon,
  PhoneIcon,
  SearchIcon,
  StarIcon,
  Text,
  TriangleIcon,
  useTheme,
} from 'shuttlex-integration';

import previewImage from '../../../assets/images/videosScreen/previewImage';
import { RootStackParamList } from '../../Navigate/props';

const windowHeight = Dimensions.get('window').height;

//TODO: Maybe move theese colors from the component?
const localСolors = {
  headerButton: '#ffffff37',
  secondaryText: '#979797',
  logoBg: '#292929',
  bottomContentBg: '#001318',
  textInBar: '#898A8DB2',
  bottomButtonWithOpacity: '#5959594D',
};

const VideosScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const computedStyles = StyleSheet.create({
    headerCircleSubContainerStyle: {
      backgroundColor: localСolors.headerButton,
    },
    headerCentralButton: {
      backgroundColor: localСolors.headerButton,
    },
    headerCentralButtonText: {
      color: colors.textTertiaryColor,
    },
    triagleIcon: {
      color: colors.iconTertiaryColor,
    },
  });

  return (
    <>
      <Carousel
        loop={true}
        vertical
        height={windowHeight}
        //TODO: Add a real data
        data={Array.from({ length: 6 })}
        renderItem={() => <VideoCard />}
      />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.headerMenuButtonsContainer}>
          <Button
            shape={ButtonShapes.Circle}
            size={ButtonSizes.S}
            style={styles.headerCircleButtonStyle}
            circleSubContainerStyle={[
              styles.headerCircleSubContainerStyle,
              computedStyles.headerCircleSubContainerStyle,
            ]}
            withBorder={false}
            onPress={navigation.goBack}
          >
            <InputXIcon color={colors.iconTertiaryColor} style={styles.headerIconStyle} />
          </Button>
          <Button style={[styles.headerCentralButton, computedStyles.headerCentralButton]}>
            <Text style={[styles.headerCentralButtonText, computedStyles.headerCentralButtonText]}>
              {t('ride_Videos_forYou')}
            </Text>
            <TriangleIcon color={computedStyles.triagleIcon.color} />
          </Button>
          <Button
            shape={ButtonShapes.Circle}
            size={ButtonSizes.S}
            style={styles.headerCircleButtonStyle}
            circleSubContainerStyle={[
              styles.headerCircleSubContainerStyle,
              computedStyles.headerCircleSubContainerStyle,
            ]}
            withBorder={false}
          >
            <SearchIcon color={colors.iconTertiaryColor} style={styles.headerIconStyle} />
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

//TOOD: Rewrite this component, maybe add an "item" props from carousel
const VideoCard = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    triagleIcon: {
      color: colors.iconTertiaryColor,
    },
    logo: {
      backgroundColor: localСolors.logoBg,
    },
    logoText: {
      color: colors.textTertiaryColor,
    },
    title: {
      color: colors.textTertiaryColor,
    },
    starIcon: {
      color: colors.primaryColor,
    },
    rating: {
      color: localСolors.secondaryText,
    },
    windowStyle: {
      backgroundColor: localСolors.bottomContentBg,
    },
    description: {
      color: localСolors.secondaryText,
    },
    textInBar: {
      color: localСolors.textInBar,
    },
    phoneIcon: {
      color: colors.iconSecondaryColor,
    },
    goButtonContainer: {
      backgroundColor: localСolors.bottomButtonWithOpacity,
    },
    goButtonText: {
      color: colors.textPrimaryColor,
    },
    reservationButton: {
      backgroundColor: localСolors.bottomButtonWithOpacity,
    },
    reservationButtonText: {
      color: colors.textTertiaryColor,
    },
    messagesButtonSubContainerStyle: {
      backgroundColor: localСolors.bottomButtonWithOpacity,
    },
    unreadNotificationsMarker: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    unreadNotificationsMarkerText: {
      color: colors.textPrimaryColor,
    },
  });

  return (
    <ImageBackground source={previewImage} resizeMode="cover" style={styles.imageBackground}>
      <BottomWindow
        windowStyle={[styles.windowStyle, computedStyles.windowStyle]}
        additionalTopContent={
          <View style={styles.logoAndTitleContainer}>
            {/* TODO: Rewrite with the real data (maybe remove this block if we receive an image) */}
            <View style={[styles.logo, computedStyles.logo]}>
              <View style={styles.triagleIcon}>
                <TriangleIcon color={computedStyles.triagleIcon.color} />
              </View>

              <Text style={[styles.logoText, computedStyles.logoText]}>BREA</Text>
              <TriangleIcon color={computedStyles.triagleIcon.color} />
            </View>
            <View style={styles.titleAndRatingContainer}>
              <Text style={[styles.title, computedStyles.title]}>Brea Dubai</Text>
              <View style={styles.ratingContainer}>
                <StarIcon color={computedStyles.starIcon.color} style={styles.starIcon} />
                <Text style={[styles.rating, computedStyles.rating]}>4,6</Text>
              </View>
            </View>
          </View>
        }
      >
        <Text style={[styles.description, computedStyles.description]}>{t('ride_Videos_description')}</Text>
        <View style={styles.placeAndSingerContainer}>
          <Bar mode={BarModes.Default} style={styles.bar}>
            <LocationIcon style={styles.locationIcon} color={localСolors.textInBar} />
            {/* TODO: Rewrite with the real data */}
            <Text style={[styles.textInBar, computedStyles.textInBar]}>Dubai Real Estate Search</Text>
          </Bar>
          <Bar mode={BarModes.Default} style={styles.bar}>
            <NoteIcon />
            {/* TODO: Rewrite with the real data */}
            <Text style={[styles.textInBar, computedStyles.textInBar]}>Taylor Swift</Text>
          </Bar>
        </View>
        <View style={styles.bottomContentContainer}>
          {/* TODO: Rewrite with the real block */}
          <View style={styles.mockBlock} />
          <Button style={styles.goButton} containerStyle={[styles.goButtonContainer, computedStyles.goButtonContainer]}>
            <Text style={[styles.goButtonText, computedStyles.goButtonText]}>{t('ride_Videos_goButton')}</Text>
          </Button>
          <Button style={[styles.reservationButton, computedStyles.reservationButton]}>
            <PhoneIcon color={computedStyles.phoneIcon.color} />
            <Text style={[styles.reservationButtonText, computedStyles.reservationButtonText]}>
              {t('ride_Videos_recervationButton')}
            </Text>
          </Button>
          <View>
            <Button
              shape={ButtonShapes.Circle}
              withBorder={false}
              style={styles.messagesButtonStyle}
              circleSubContainerStyle={computedStyles.messagesButtonSubContainerStyle}
            >
              <ChatIcon2 />
            </Button>
            <View style={[styles.unreadNotificationsMarker, computedStyles.unreadNotificationsMarker]}>
              {/* TODO: Rewrite with the real data */}
              <Text style={[styles.unreadNotificationsMarkerText, computedStyles.unreadNotificationsMarkerText]}>
                12
              </Text>
            </View>
          </View>
        </View>
      </BottomWindow>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    height: '100%',
  },
  safeAreaView: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerMenuButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 46,
  },
  headerCircleButtonStyle: {
    backgroundColor: undefined,
  },
  headerCircleSubContainerStyle: {
    padding: 14,
  },
  headerIconStyle: {
    width: '100%',
    height: '100%',
  },
  headerCentralButton: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 30,
    height: 48,
  },
  headerCentralButtonText: {
    fontFamily: 'Inter Medium',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  triagleIcon: {
    transform: [{ rotateZ: '180deg' }],
  },
  logoAndTitleContainer: {
    flexDirection: 'row',
    gap: 28,
    paddingHorizontal: 8,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  logoText: {
    fontFamily: 'Inter Medium',
    fontSize: 8,
    letterSpacing: 4,
  },
  titleAndRatingContainer: {
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Inter Medium',
    fontSize: 22,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starIcon: {
    width: 10,
    height: 10,
  },
  rating: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  windowStyle: {
    paddingTop: 0,
  },
  description: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
    marginTop: 14,
  },
  placeAndSingerContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  textInBar: {
    fontSize: 12,
  },
  locationIcon: {
    height: 14,
    width: 14,
  },
  bottomContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  mockBlock: {
    width: 46,
    height: 46,
    backgroundColor: 'red',
    borderRadius: 100,
  },
  goButtonContainer: {
    borderRadius: 50,
    padding: 2,
  },
  goButton: {
    height: 46,
    borderRadius: 50,
    borderWidth: 2,
  },
  goButtonText: {
    fontFamily: 'Inter SemiBold',
    fontSize: 18,
    lineHeight: 32,
  },
  reservationButton: {
    flexDirection: 'row',
    gap: 10,
    height: 50,
    borderRadius: 50,
  },
  reservationButtonText: {
    fontFamily: 'Inter SemiBold',
    fontSize: 14,
    letterSpacing: 0,
  },
  messagesButtonStyle: {
    backgroundColor: undefined,
    height: 50,
    width: 50,
  },
  unreadNotificationsMarker: {
    position: 'absolute',
    top: -4,
    right: -4,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderRadius: 100,
  },
  unreadNotificationsMarkerText: {
    fontFamily: 'Inter Bold',
    fontSize: 8,
    letterSpacing: 0,
  },
});

export default VideosScreen;
