import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  BigHeader,
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Button,
  MysteryBoxIcon,
  SquareButtonModes,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { sendMysteryBoxPopupResponse } from '../../../../../core/ride/redux/trip/thunks';
import { MysteryBoxPopupProps } from './types';

const MysteryBoxPopup = ({ setIsMysteryBoxPopupVisible }: MysteryBoxPopupProps) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const closeWindow = bottomWindowRef.current?.closeWindow;

  //TODO: Add sending answer to back-end
  const onPressGreat = async () => {
    await dispatch(sendMysteryBoxPopupResponse({ passengerId: '', res: true }));
    closeWindow?.();
    setIsMysteryBoxPopupVisible(false);
  };

  //TODO: Add logic for navigation to "More info"
  const onPressMoreInfo = () => {
    closeWindow?.();
    setIsMysteryBoxPopupVisible(false);
  };

  return (
    <BottomWindowWithGesture
      ref={bottomWindowRef}
      withShade
      setIsOpened={setIsMysteryBoxPopupVisible}
      opened={true}
      hiddenPartContainerStyle={styles.hiddenPartContainerStyle}
      hiddenPart={
        <View>
          <BigHeader
            windowTitle={t('ride_Ride_MysteryBoxPopup_subTitle')}
            firstHeaderTitle={t('ride_Ride_MysteryBoxPopup_firstTitle')}
            secondHeaderTitle={t('ride_Ride_MysteryBoxPopup_secondTitle')}
            description={t('ride_Ride_MysteryBoxPopup_description')}
            headerInOneLine
          />
          <MysteryBoxIcon style={styles.mysteryBoxIcon} />
          <View style={styles.buttonsContainer}>
            <Button
              containerStyle={styles.button}
              text={t('ride_Ride_MysteryBoxPopup_greatButton')}
              onPress={onPressGreat}
            />
            <Button
              containerStyle={styles.button}
              text={t('ride_Ride_MysteryBoxPopup_moreInfoButton')}
              mode={SquareButtonModes.Mode5}
              onPress={onPressMoreInfo}
            />
          </View>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  hiddenPartContainerStyle: {
    marginTop: 6,
  },
  mysteryBoxIcon: {
    alignSelf: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});

export default MysteryBoxPopup;
