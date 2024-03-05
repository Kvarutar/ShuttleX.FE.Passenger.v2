import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  MenuIcon,
  NotificationIcon,
  RoundButton,
  sizes,
  StopWatch,
  Text,
  Timer,
  TimerModes,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { useGeolocationStartWatch } from '../../../core/ride/hooks';
import { setTripStatus } from '../../../core/ride/redux/trip';
import { ContractorInfoSelector, TripStatusSelector } from '../../../core/ride/redux/trip/selectors';
import { TripStatus } from '../../../core/ride/redux/trip/types';
import Offer from './Offer';
import { RideScreenProps } from './props';
import Trip from './Trip';

const timerAnimationDuration = 300;

const RideScreen = ({ navigation }: RideScreenProps): JSX.Element => {
  const { colors } = useTheme();

  const dispatch = useAppDispatch();
  const [isPassangerLate, setIsPassangerLate] = useState<boolean>(false);
  const tripStatus = useSelector(TripStatusSelector);

  const contractorInfo = useSelector(ContractorInfoSelector);

  useEffect(() => {
    if (contractorInfo) {
      setTimeout(() => {
        dispatch(setTripStatus(TripStatus.Arrived)); //for test
      }, 6000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractorInfo]);

  useGeolocationStartWatch();

  const computedStyles = StyleSheet.create({
    topButtonsContainer: {
      paddingTop: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  const headerTimer = () => {
    if (tripStatus === TripStatus.Arrived) {
      if (isPassangerLate) {
        return (
          <Animated.View
            exiting={FadeOut.duration(timerAnimationDuration)}
            entering={FadeIn.duration(timerAnimationDuration)}
            style={styles.additionalHeaderButtons}
          >
            <Timer
              initialDate={new Date()}
              startColor={colors.secondaryGradientStartColor}
              endColor={colors.secondaryGradientEndColor}
              mode={TimerModes.Mini}
            />
          </Animated.View>
        );
      }
      return (
        <Animated.View
          exiting={FadeOut.duration(timerAnimationDuration)}
          entering={FadeIn.duration(timerAnimationDuration)}
          style={styles.additionalHeaderButtons}
        >
          <Timer
            initialDate={new Date(Date.now() + 20000)} //20000 - for test
            onAfterCountdownEnds={() => setIsPassangerLate(true)}
            startColor={colors.primaryGradientStartColor}
            endColor={colors.primaryColor}
            mode={TimerModes.Mini}
          />
        </Animated.View>
      );
    }
  };

  return (
    <>
      <View style={styles.map}>
        <Text>Map</Text>
      </View>
      <SafeAreaView style={styles.wrapper}>
        <View style={[styles.topButtonsContainer, computedStyles.topButtonsContainer]}>
          <RoundButton>
            <MenuIcon />
          </RoundButton>
          {contractorInfo && tripStatus === TripStatus.Idle && (
            <StopWatch initialDate={new Date(Date.now() + 121000)} mask="{m}m" onAfterCountdownEnds={() => {}} />
          )}
          <View style={styles.headerRightButtons}>
            <RoundButton onPress={() => navigation.navigate('Rating')}>
              <NotificationIcon />
            </RoundButton>
            {headerTimer()}
          </View>
        </View>
        {contractorInfo ? <Trip /> : <Offer navigation={navigation} />}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  wrapper: {
    flex: 1,
  },
  topButtonsContainer: {
    paddingHorizontal: sizes.paddingHorizontal,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerRightButtons: {
    alignItems: 'center',
  },
  additionalHeaderButtons: {
    marginTop: 30,
  },
});

export default RideScreen;
