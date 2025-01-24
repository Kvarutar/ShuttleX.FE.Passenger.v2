import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Confetti, InputXIcon, SafeAreaView, Text, useTheme } from 'shuttlex-integration';

import { lotterySelectModeSelector, lotteryStateSelector } from '../../core/lottery/redux/selectors.ts';
import { RootStackParamList } from '../../Navigate/props';
import Lottery from './Lottery';
import Season from './Season';
import SmallButton from './SmallButton';

const RaffleScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Raffle'>>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const lotteryState = useSelector(lotteryStateSelector);
  const lotterySelectMode = useSelector(lotterySelectModeSelector);

  const [isLotterySelected] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const computedStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    icon: {
      color: colors.iconPrimaryColor,
    },
  });

  const showConfettiHandler = useCallback(() => setShowConfetti(true), []);

  return (
    <>
      <SafeAreaView containerStyle={[styles.container, computedStyles.container]} wrapperStyle={styles.wrapper}>
        <View style={styles.topButtons}>
          <SmallButton icon={<InputXIcon color={computedStyles.icon.color} />} onPress={navigation.goBack} />
          {/* <GroupedButtons
            width={230}
            firstButtonText={t('raffle_Raffle_lotteryButton')}
            secondButtonText={t('raffle_Raffle_seasonButton')}
            isFirstButtonSelected={isLotterySelected}
            setIsFirstButtonSelected={() => {
              //TODO will be add later
            }}
          /> */}
          <View style={styles.headerTitleContainer}>
            <Text>
              {t(
                lotteryState === 'CurrentUpcoming' || lotterySelectMode === 'history'
                  ? 'raffle_Raffle_defaultTitle'
                  : 'raffle_Raffle_winnersTitle',
              )}
            </Text>
          </View>
          {/*TODO will be add later*/}
          {/*<SmallButton*/}
          {/*  icon={<UploadIcon />}*/}
          {/*  onPress={() => {*/}
          {/*    console.log('TODO: onSharePress');*/}
          {/*  }}*/}
          {/*/>*/}
        </View>
      </SafeAreaView>

      {isLotterySelected ? <Lottery triggerConfetti={showConfettiHandler} /> : <Season />}

      <Confetti showConfetti={showConfetti} onConfettiEnd={() => setShowConfetti(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingBottom: 0,
  },
  wrapper: {
    flex: 0,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 44,
  },
});

export default RaffleScreen;
