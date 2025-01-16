import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { BigHeader, BottomWindowWithGesture, Button } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { setIsTooShortRouteLengthPopupVisible } from '../../../../../core/ride/redux/offer';
import { setIsAddressSelectVisible, setOrderStatus } from '../../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../../core/ride/redux/order/types';

const TooShortRouteLengthPopup = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onPress = () => {
    dispatch(setIsTooShortRouteLengthPopupVisible(false));
    dispatch(setOrderStatus(OrderStatus.StartRide));
    dispatch(setIsAddressSelectVisible(true));
  };

  return (
    <BottomWindowWithGesture
      opened
      withShade
      setIsOpened={(newState: boolean) => dispatch(setIsTooShortRouteLengthPopupVisible(newState))}
      hiddenPart={
        <View>
          <BigHeader
            windowTitle={t('ride_Ride_TooShortRouteLengthPopup_subTitle')}
            firstHeaderTitle={t('ride_Ride_TooShortRouteLengthPopup_firstTitle')}
            description={t('ride_Ride_TooShortRouteLengthPopup_description')}
          />
          <View>
            <Button
              containerStyle={styles.button}
              text={t('ride_Ride_TooShortRouteLengthPopup_changeButton')}
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

export default TooShortRouteLengthPopup;
