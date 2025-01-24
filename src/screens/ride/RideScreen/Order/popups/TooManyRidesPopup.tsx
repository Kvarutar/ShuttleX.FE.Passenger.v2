import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { BigHeader, BottomWindowWithGesture, Button } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { setIsTooManyRidesPopupVisible } from '../../../../../core/ride/redux/offer';

const TooManyRidesPopup = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onPress = () => {
    dispatch(setIsTooManyRidesPopupVisible(false));
  };

  return (
    <BottomWindowWithGesture
      opened
      withShade
      setIsOpened={(newState: boolean) => dispatch(setIsTooManyRidesPopupVisible(newState))}
      hiddenPart={
        <View>
          <BigHeader
            windowTitle={t('ride_Ride_TooManyRidesPopup_subTitle')}
            firstHeaderTitle={t('ride_Ride_TooManyRidesPopup_firstTitle')}
            description={t('ride_Ride_TooManyRidesPopup_description')}
          />
          <View>
            <Button
              containerStyle={styles.button}
              text={t('ride_Ride_TooManyRidesPopup_changeButton')}
              onPress={onPress}
            />
          </View>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 42,
  },
});

export default TooManyRidesPopup;
