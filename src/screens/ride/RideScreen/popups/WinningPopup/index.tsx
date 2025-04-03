import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BigHeader,
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Button,
  Confetti,
  SquareButtonModes,
  WINDOW_HEIGHT,
} from 'shuttlex-integration';

import { lotteryPrizesSelector, lotteryWinnerSelector } from '../../../../../core/lottery/redux/selectors';
import { prizesData } from '../../../../raffle/Lottery/prizesData';
import { WinningPopupProps } from './types';

const WinningPopup = ({ setIsWinningPopupVisible }: WinningPopupProps) => {
  const { t } = useTranslation();

  const lotteryWinner = useSelector(lotteryWinnerSelector);
  const lotteryPrizes = useSelector(lotteryPrizesSelector);

  const winner = lotteryPrizes.find(item => item.ticketNumber === lotteryWinner?.ticket);

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const closeWindow = bottomWindowRef.current?.closeWindow;

  const onPressGreat = () => {
    closeWindow?.();
    setIsWinningPopupVisible(false);
  };

  //TODO: Add logic for navigation to "More info"
  const onPressMoreInfo = () => {
    closeWindow?.();
    setIsWinningPopupVisible(false);
  };

  const computedStyles = StyleSheet.create({
    imageContainer: {
      maxHeight: WINDOW_HEIGHT * 0.3,
    },
  });

  if (winner) {
    const hiddenPartContent = (
      <View>
        <BigHeader
          windowTitle={t('ride_Ride_WinningPopup_subTitle')}
          firstHeaderTitle={t('ride_Ride_WinningPopup_firstTitle')}
          secondHeaderTitle={t('ride_Ride_WinningPopup_secondTitle', { ticketNumber: lotteryWinner?.ticket })}
          description={t('ride_Ride_WinningPopup_description', { place: winner.index + 1 })}
        />
        <View style={[styles.imageContainer, computedStyles.imageContainer]}>
          <Image source={prizesData[winner.prizes[0].feKey].image} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            containerStyle={styles.button}
            text={t('ride_Ride_WinningPopup_greatButton')}
            onPress={onPressGreat}
          />
          <Button
            containerStyle={styles.button}
            text={t('ride_Ride_WinningPopup_moreInfoButton')}
            mode={SquareButtonModes.Mode5}
            onPress={onPressMoreInfo}
          />
        </View>
      </View>
    );

    return (
      <View style={StyleSheet.absoluteFill}>
        <SafeAreaView style={styles.confettiContainer}>
          <Confetti showConfetti />
        </SafeAreaView>
        <BottomWindowWithGesture
          ref={bottomWindowRef}
          withShade
          setIsOpened={setIsWinningPopupVisible}
          opened={true}
          hiddenPart={hiddenPartContent}
          hiddenPartContainerStyle={styles.hiddenPartContainerStyle}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  hiddenPartContainerStyle: {
    marginTop: 6,
  },
  confettiContainer: {
    zIndex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
  imageContainer: {
    marginVertical: 48,
  },
  image: {
    maxHeight: '100%',
    maxWidth: '90%',
    alignSelf: 'center',
  },
});

export default WinningPopup;
