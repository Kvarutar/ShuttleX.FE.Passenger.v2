import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { BigHeader, BottomWindowWithGesture, Button, SquareButtonModes } from 'shuttlex-integration';

import { UnsupportedDestinationPopupProps } from './types';

const UnsupportedDestinationPopup = ({ setIsUnsupportedDestinationPopupVisible }: UnsupportedDestinationPopupProps) => {
  const { t } = useTranslation();

  //TODO: add navigation to Support
  const onSupportPress = () => {
    setIsUnsupportedDestinationPopupVisible(false);
  };

  const hiddenPartContent = (
    <View>
      <BigHeader
        windowTitle={t('ride_Ride_UnsupportedDestinationPopup_subTitle')}
        firstHeaderTitle={t('ride_Ride_UnsupportedDestinationPopup_firstTitle')}
        secondHeaderTitle={t('ride_Ride_UnsupportedDestinationPopup_secondTitle')}
        description={t('ride_Ride_UnsupportedDestinationPopup_description')}
      />
      <View style={styles.buttonsContainer}>
        <Button
          containerStyle={styles.button}
          text={t('ride_Ride_UnsupportedDestinationPopup_supportButton')}
          onPress={onSupportPress}
        />
        <Button
          containerStyle={styles.button}
          text={t('ride_Ride_UnsupportedDestinationPopup_closeButton')}
          mode={SquareButtonModes.Mode5}
          onPress={() => setIsUnsupportedDestinationPopupVisible(false)}
        />
      </View>
    </View>
  );

  return (
    <BottomWindowWithGesture
      withShade
      opened
      setIsOpened={setIsUnsupportedDestinationPopupVisible}
      hiddenPart={hiddenPartContent}
    />
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 110,
  },
  button: {
    flex: 1,
  },
});

export default UnsupportedDestinationPopup;
