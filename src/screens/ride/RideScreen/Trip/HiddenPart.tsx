import { useTranslation } from 'react-i18next';
import { ImageBackground, Linking, StyleSheet, View } from 'react-native';
import {
  Bar,
  BarModes,
  EmergencyServiceIcon,
  getCurrencySign,
  ReportIcon,
  Text,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

//TODO: take image from BE
import imageCapybaraBackground from '../../../../../assets/images/trip/imageCapybaraBackground';
import imagePrizeBackground from '../../../../../assets/images/trip/imagePrizeBackground';
import passengerColors from '../../../../shared/colors/colors';
import { ContractorInfoTestType, SquareBarProps } from './types';

//TODO: swap to contractorInfo from BE
const contractorInfoTest: ContractorInfoTestType = {
  tariffType: 'Basic',
  total: 20,
  capiAmount: 14,
  mysteryBoxNumber: 123,
};

const SquareBar = ({ icon, text, onPress, mode }: SquareBarProps) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    text: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <Bar onPress={onPress} mode={mode} style={styles.squareBarContainer}>
      {icon}
      <Text style={[styles.squareBarText, computedStyles.text]}>{text}</Text>
    </Bar>
  );
};

const TripInfoBar = ({ info }: { info: { text: string; value: string; barMode?: BarModes } }) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    text: {
      color: info.barMode ? colors.textPrimaryColor : colors.textSecondaryColor,
    },
  });

  return (
    <Bar key={info.text} mode={info.barMode ? info.barMode : BarModes.Disabled} style={styles.tripInfoBar}>
      <Text style={[styles.tripInfoBarText, computedStyles.text]}>{info.text}</Text>
      <Text style={styles.tripInfoBarText}>{info.value}</Text>
    </Bar>
  );
};

const HiddenPart = ({ extraSum }: { extraSum: number }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const tariffIconsData = useTariffsIcons();

  const computedStyles = StyleSheet.create({
    firstSeasonTitleText: {
      color: colors.textTertiaryColor,
    },
    capiText: {
      color: passengerColors.adsBackgroundColor.whiteOpacityStrong,
    },
    capiAmountContainer: {
      backgroundColor: contractorInfoTest.capiAmount
        ? colors.primaryColor
        : passengerColors.adsBackgroundColor.whiteOpacityLight,
    },
    capiAmountText: {
      color: contractorInfoTest.capiAmount ? colors.textPrimaryColor : colors.textTertiaryColor,
    },
  });

  const tripInfo = [
    {
      text: t('ride_Ride_Trip_mysteryBoxTitle'),
      value: t('ride_Ride_Trip_mysteryBoxNo', { count: contractorInfoTest.mysteryBoxNumber }),
      barMode: BarModes.Default,
    },
    {
      text: t('ride_Ride_Trip_tripType'),
      value: tariffIconsData[contractorInfoTest.tariffType].text,
    },
    {
      text: t('ride_Ride_Trip_totalForRide'),
      //TODO: swap currencyCode to correct value
      value: `${getCurrencySign('UAH')}${contractorInfoTest.total + extraSum}`,
    },
  ];

  return (
    <View style={styles.container}>
      {/*TODO: remove comments when we will have game and achievements screens*/}
      {/*<View style={styles.squareBarWrapper}>*/}
      {/*  <SquareBar*/}
      {/*    icon={<Image source={imageBossEarth} style={styles.image} />}*/}
      {/*    text={t('ride_Ride_Trip_playGame')}*/}
      {/*    //TODO: navigate to game*/}
      {/*    onPress={() => true}*/}
      {/*  />*/}
      {/*  <SquareBar*/}
      {/*    icon={<Image source={imageCapybara} style={styles.image} />}*/}
      {/*    text={t('ride_Ride_Trip_Achievements')}*/}
      {/*    //TODO: navigate to achievements*/}
      {/*    onPress={() => true}*/}
      {/*  />*/}
      {/*</View>*/}
      <View style={styles.squareBarWrapper}>
        <Bar style={styles.firstSeasonBarContainer}>
          <ImageBackground style={StyleSheet.absoluteFill} source={imagePrizeBackground} resizeMode="cover" />
          <Text style={[styles.firstSeasonTitleText, computedStyles.firstSeasonTitleText]}>
            {t('ride_Ride_Trip_prize')}
          </Text>
        </Bar>
        <Bar style={styles.firstSeasonBarContainer}>
          <ImageBackground style={StyleSheet.absoluteFill} source={imageCapybaraBackground} resizeMode="cover" />
          <Text style={[styles.firstSeasonTitleText, computedStyles.firstSeasonTitleText]}>
            {t('ride_Ride_Trip_firstSeason')}
          </Text>
          <Text style={[styles.capiText, computedStyles.capiText]}>{contractorInfoTest.capiAmount}/20</Text>
          <View style={[styles.capiAmountContainer, computedStyles.capiAmountContainer]}>
            <Text style={[styles.capiAmountText, computedStyles.capiAmountText]}>{contractorInfoTest.capiAmount}</Text>
          </View>
        </Bar>
      </View>
      {tripInfo.map((info, index) => (
        <TripInfoBar info={info} key={index} />
      ))}
      <View style={styles.squareBarWrapper}>
        <SquareBar
          mode={BarModes.Default}
          icon={<EmergencyServiceIcon />}
          text={t('ride_Ride_Trip_contactEmergency')}
          onPress={() => Linking.openURL('tel:911')}
        />
        <SquareBar
          mode={BarModes.Default}
          icon={<ReportIcon />}
          text={t('ride_Ride_Trip_reportIssue')}
          //TODO: navigate to report
          onPress={() => true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 16,
  },
  squareBarWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  squareBarContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  squareBarText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 9,
  },
  tripInfoBar: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  tripInfoBarText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  image: {
    height: 33,
    width: 43,
    objectFit: 'contain',
  },
  firstSeasonBarContainer: {
    flex: 1,
    padding: 16,
  },
  firstSeasonTitleText: {
    fontFamily: 'Inter Bold',
    fontSize: 14,
    lineHeight: 16,
  },
  capiText: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  capiAmountContainer: {
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  capiAmountText: {
    fontFamily: 'Inter Bold',
    fontSize: 11,
  },
});

export default HiddenPart;
