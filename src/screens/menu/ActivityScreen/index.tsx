import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Bar,
  MenuHeader,
  SafeAreaView,
  TariffType,
  Text,
  TrafficIndicator,
  TrafficLevel,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';
import { RecentTrip } from './props';
import RecentAddressesBar from './RecentAddressesBar';

//TODO: swap to correct data
const testTripData = {
  contractor: {
    image:
      'https://s3-alpha-sig.figma.com/img/9446/d564/bd2ec06179682d62415780b8d0976216?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=G3inQsZfGmT-sasyhZFIjzq5DqM9DjtpwryK~aVrkWsI5Tn1o23HB2rc0DlCkthc80ho6aLY1YZQjRzufSDobarb~054nk~3rxKnBGiKDWnj3bMziQXyIFt7jU13R8TKSpAB2PDM82OayfZhHePbM16G~aL5WAL5nHCUAc1Fb6hKqPB3NJhYKYc0irwkLtdrDFDLOeu4lpo5ecV8tXFYLunxZdtrZvxfghNp8A23xn5YL3-q-lTE-rCAYwmEAVxgNWa7af5sRy0rZmJVPdJHr-GCsvVtRfZM718CNggQ4h2jC77SVZHo9qQ5lJA6wVrWW536en2CNGsyUlcLQubsow__',
    name: 'Slava Kornilov',
    car: {
      model: 'Land Cruiser',
    },
  },
  tripType: 'Basic' as TariffType,
};

const testRecentAddresses: RecentTrip[] = [
  {
    address: 'Restaurant',
    details: 'StreetEasy: NYC Real Estate',
    status: null,
    date: new Date(),
    tripType: 'Basic',
  },
  {
    address: 'Restaurant',
    details: 'StreetEasy: NYC Real Estate test',
    status: 12,
    date: new Date('2021-05-22T18:15:00'),
    tripType: 'Basic',
  },
  {
    address: 'Restaurant Long Long Long Long Long Long',
    details: 'StreetEasy: NYC Real Estate',
    status: 53,
    date: new Date('2024-10-09T16:20:00'),
    tripType: 'Eco',
  },
  {
    address: 'Restaurant',
    details: 'StreetEasy: NYC Real Estate Long Long Long Long Long Long',
    status: null,
    date: new Date('2023-01-15T09:45:00'),
    tripType: 'Business',
  },
  {
    address: 'Restaurant',
    details: 'StreetEasy: NYC Real Estate',
    status: 23,
    date: new Date('2022-07-30T14:30:00'),
    tripType: 'ComfortPlus',
  },
];

const ActivityScreen = () => {
  const { navigation } = useNavigation<NativeStackScreenProps<RootStackParamList, 'Activity'>>();
  const tariffIconsData = useTariffsIcons();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const TariffImage = tariffIconsData[testTripData.tripType].icon;

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const computedStyles = StyleSheet.create({
    text: {
      color: colors.textSecondaryColor,
    },
  });

  //TODO: For test, delete after connect with back
  const [currentDistance, setCurrentDistance] = useState(0);
  const totalDistance = 100;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDistance(prevDistance => {
        const newDistance = prevDistance + 10;
        return Math.min(newDistance, totalDistance);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SafeAreaView>
        <MenuHeader
          onMenuPress={() => setIsMenuVisible(true)}
          onNotificationPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.headerText}>{t('menu_Activity_title')}</Text>
        </MenuHeader>
        {testTripData && (
          <Bar style={styles.currentTripContainer}>
            <View style={styles.imageContainer}>
              <Image style={styles.avatar} source={{ uri: testTripData.contractor.image }} />
              <TariffImage style={styles.carImage} />
            </View>
            <Text style={[styles.currentTripTitleText, computedStyles.text]}>{t('menu_Activity_activeOrder')}</Text>
            <View style={styles.contractorInfoContainer}>
              <Text style={styles.nameText}>{testTripData.contractor.name}</Text>
              <Text style={[styles.carModelText, computedStyles.text]}>{testTripData.contractor.car.model}</Text>
            </View>
            {/*TODO: delete mock data*/}
            <TrafficIndicator
              containerStyle={styles.trafficIndicatorContainer}
              currentPercent={`${currentDistance}%`}
              segments={[
                { percent: '15%', level: TrafficLevel.Low },
                { percent: '15%', level: TrafficLevel.Average },
                { percent: '30%', level: TrafficLevel.High },
                { percent: '40%', level: TrafficLevel.Low },
              ]}
              startTime={43200}
              endTime={45000}
            />
          </Bar>
        )}
        <View style={styles.recentAddressesWrapper}>
          <Text style={[styles.recentAddressesTitleText, computedStyles.text]}>
            {t('menu_Activity_recentAddresses')}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.recentAddressesContainer}>
              {testRecentAddresses.map((trip, index) => (
                <RecentAddressesBar key={index} trip={trip} />
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
  },
  currentTripContainer: {
    padding: 16,
    marginTop: 16,
  },
  carImage: {
    width: '45%',
    height: undefined,
    aspectRatio: 3.3,
    flexShrink: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  contractorInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  carModelText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  currentTripTitleText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
    letterSpacing: -0.64,
  },
  nameText: {
    fontSize: 21,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
  recentAddressesWrapper: {
    flex: 1,
  },
  recentAddressesContainer: {
    gap: 8,
  },
  recentAddressesTitleText: {
    fontSize: 14,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
    marginTop: 16,
    marginBottom: 12,
  },
  trafficIndicatorContainer: {
    marginTop: 20,
  },
});

export default ActivityScreen;
