import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import { Bar, BarModes, EmergencyServiceIcon, ReportIcon, Text, useTheme } from 'shuttlex-integration';

import { SquareBarProps } from './props';

const contractorInfoTest = {
  tripType: 'Basic',
  total: 20,
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

const HiddenPart = ({ extraSum }: { extraSum: number }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    text: {
      color: colors.textSecondaryColor,
    },
  });

  const tripInfo = [
    {
      text: t('ride_Ride_Trip_tripType'),
      value: contractorInfoTest.tripType,
    },
    {
      text: t('ride_Ride_Trip_totalForRide'),
      value: `$${contractorInfoTest.total + extraSum}`,
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
      {tripInfo.map(info => (
        <Bar key={info.text} mode={BarModes.Disabled} style={styles.tripInfoBar}>
          <Text style={[styles.tripInfoBarText, computedStyles.text]}>{info.text}</Text>
          <Text style={styles.tripInfoBarText}>{info.value}</Text>
        </Bar>
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
});

export default HiddenPart;
