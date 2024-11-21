import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Confetti, InputXIcon, SafeAreaView, Text, UploadIcon, useTheme } from 'shuttlex-integration';

import { RootStackParamList } from '../../Navigate/props';
import Lottery from './Lottery';
import Season from './Season';
import SmallButton from './SmallButton';

const RaffleScreen = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Raffle'>>();

  const { colors } = useTheme();

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
          <Text>Winners</Text>
          <SmallButton
            icon={<UploadIcon />}
            onPress={() => {
              console.log('TODO: onSharePress');
            }}
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
  },
  wrapper: {
    flex: 0,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default RaffleScreen;
