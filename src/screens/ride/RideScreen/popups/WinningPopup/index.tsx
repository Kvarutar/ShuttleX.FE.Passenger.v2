import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  BigHeader,
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Button,
  Confetti,
  SquareButtonModes,
} from 'shuttlex-integration';

//TODO: take image from BE
import imageWinningPrize from '../../../../../../assets/images/imageWinningPrize';
import { WinningPopupProps } from './types';

const windowHeight = Dimensions.get('window').height;

const WinningPopup = ({ setIsWinningPopupVisible }: WinningPopupProps) => {
  const { t } = useTranslation();

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

  const hiddenPartContent = (
    <View>
      <BigHeader
        windowTitle={t('ride_Ride_WinningPopup_subTitle')}
        firstHeaderTitle={t('ride_Ride_WinningPopup_firstTitle')}
        secondHeaderTitle={t('ride_Ride_WinningPopup_secondTitle')}
        description={t('ride_Ride_WinningPopup_description')}
      />
      <View style={styles.imageContainer}>
        <Image source={imageWinningPrize} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.buttonsContainer}>
        <Button containerStyle={styles.button} text={t('ride_Ride_WinningPopup_greatButton')} onPress={onPressGreat} />
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
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
  hiddenPartContainerStyle: {
    paddingTop: 24,
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
    maxHeight: windowHeight * 0.3,
    marginVertical: 48,
  },
  image: {
    maxHeight: '100%',
    maxWidth: '90%',
    alignSelf: 'center',
  },
});

export default WinningPopup;
