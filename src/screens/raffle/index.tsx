import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Confetti, InputXIcon, QuestionRoundIcon, SafeAreaView, Text, useTheme } from 'shuttlex-integration';

import { logger } from '../../App.tsx';
import i18n from '../../core/locales/i18n.ts';
import { lotterySelectModeSelector, lotteryStateSelector } from '../../core/lottery/redux/selectors.ts';
import { RootStackParamList } from '../../Navigate/props';
import Lottery from './Lottery';
import Season from './Season';
import SmallButton from './SmallButton';

export const lotteryPolicyLink =
  i18n.language === 'ru' || i18n.language === 'uk'
    ? 'https://www.shuttlex.com/%D0%9B%D0%BE%D1%82%D0%B5%D1%80%D0%B5%D1%8F.pdf'
    : 'https://www.shuttlex.com/Challenge.pdf';

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
          <SmallButton
            icon={<QuestionRoundIcon />}
            onPress={() => Linking.openURL(lotteryPolicyLink).catch(logger.error)}
          />
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
  },
});

export default RaffleScreen;
