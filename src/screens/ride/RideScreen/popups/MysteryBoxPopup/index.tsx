import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Button,
  MysteryBoxIcon,
  SquareButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { sendMysteryBoxPopupResponse } from '../../../../../core/ride/redux/trip/thunks';
import { MysteryBoxPopupProps } from './types';

const MysteryBoxPopup = ({ setIsMysteryBoxPopupVisible }: MysteryBoxPopupProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const dispatch = useAppDispatch();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const closeWindow = bottomWindowRef.current?.closeWindow;

  const computedStyles = StyleSheet.create({
    subTitle: {
      color: colors.textTitleColor,
    },
    firstTitle: {
      color: colors.textPrimaryColor,
    },
    secondTitle: {
      color: colors.textQuadraticColor,
    },
    description: {
      color: colors.textSecondaryColor,
    },
  });

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
      setIsOpened={setIsMysteryBoxPopupVisible}
      opened={true}
      hiddenPartContainerStyle={styles.hiddenPartContainerStyle}
      hiddenPart={
        <View>
          <Text style={[styles.subTitle, computedStyles.subTitle]}>{t('ride_Ride_MysteryBoxPopup_subTitle')}</Text>
          <View style={styles.firstSecontTitlesContainer}>
            <Text style={[styles.firstTitle, computedStyles.firstTitle]}>
              {t('ride_Ride_MysteryBoxPopup_firstTitle')}{' '}
              <Text style={[styles.secondTitle, computedStyles.secondTitle]}>
                {t('ride_Ride_MysteryBoxPopup_secondTitle')}
              </Text>
            </Text>
          </View>
          <Text style={[styles.description, computedStyles.description]}>
            {t('ride_Ride_MysteryBoxPopup_description')}
          </Text>
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
    paddingTop: 24,
  },
  subTitle: {
    fontFamily: 'Inter Bold',
    fontSize: 14,
    marginBottom: 14,
  },
  firstSecontTitlesContainer: {
    flexDirection: 'row',
    marginBottom: 9,
  },
  firstTitle: {
    fontFamily: 'Inter Bold',
    fontSize: 34,
    letterSpacing: -1.53,
    lineHeight: 34,
  },
  secondTitle: {
    fontFamily: 'Inter Bold',
    fontSize: 34,
    letterSpacing: -1.53,
    lineHeight: 34,
  },
  description: {
    fontSize: 14,
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
