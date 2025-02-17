import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  BarModes,
  CloseIcon,
  Fog,
  LoadingSpinner,
  sizes,
  Text,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';

import { useMap } from '../../../../core/map/mapContext';
import { setActiveBottomWindowYCoordinate } from '../../../../core/passenger/redux';
import { activeBottomWindowYCoordinateSelector } from '../../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { offerPointsSelector } from '../../../../core/ride/redux/offer/selectors';
import { cancelOffer } from '../../../../core/ride/redux/offer/thunks';
import { setIsOrderCanceled } from '../../../../core/ride/redux/trip';
import { isCancelOfferLoadingSelector } from '../../../../core/ride/redux/trip/selectors';

const Confirming = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const tariffsIconsData = useTariffsIcons();
  const { mapRef } = useMap();

  const isCancelOfferLoading = useSelector(isCancelOfferLoadingSelector);
  const offerPoints = useSelector(offerPointsSelector);
  const activeBottomWindowYCoordinate = useSelector(activeBottomWindowYCoordinateSelector);

  const [dotsCounter, setDotsCounter] = useState(3);

  useEffect(() => {
    dispatch(setActiveBottomWindowYCoordinate(null));

    const interval = setInterval(() => {
      setDotsCounter(prevCount => {
        if (prevCount > 2) {
          return 1;
        }
        return prevCount + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    // If map finished resizing
    if (activeBottomWindowYCoordinate === null) {
      const offerPoint = offerPoints[0];
      setTimeout(() => {
        // TODO: make camera autozoom to fit both all thinking cars and start point marker
        mapRef.current?.animateCamera(
          {
            pitch: 0,
            heading: 0,
            center: { latitude: offerPoint.latitude, longitude: offerPoint.longitude },
            zoom: 12, // approximately 9km diameter
          },
          { duration: 1500 },
        );
      }, 0);
    }
  }, [mapRef, offerPoints, activeBottomWindowYCoordinate]);

  const TariffImage = tariffsIconsData.Basic.icon;

  const computedStyles = StyleSheet.create({
    button: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    buttonText: {
      color: colors.textSecondaryColor,
    },
    closeButtonContainer: {
      marginBottom: sizes.paddingVertical / 2,
    },
  });

  const onPressCancel = () => {
    if (!isCancelOfferLoading) {
      dispatch(cancelOffer());
      //Because this state sometimes changes before we end up to this screen, here it's cleaning
      //TODO: Think about cleaner way
      dispatch(setIsOrderCanceled(false));
    }
  };

  return (
    <>
      <Fog withAnimation />
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <TariffImage style={styles.image} />
          <Text style={styles.topText}>
            {t('ride_Ride_Confirming_searchDrivers', { dots: '.'.repeat(dotsCounter) })}
          </Text>
        </View>
        <View style={computedStyles.closeButtonContainer}>
          <Bar mode={BarModes.Disabled} style={[styles.button, computedStyles.button]} onPress={onPressCancel}>
            {isCancelOfferLoading ? (
              <LoadingSpinner iconMode={{ size: 60, strokeWidth: 5 }} />
            ) : (
              <CloseIcon style={styles.closeIcon} />
            )}
          </Bar>
          <Text style={[styles.buttonText, computedStyles.buttonText]}>{t('ride_Ride_Confirming_cancelButton')}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 20,
    zIndex: 1,
    justifyContent: 'space-between',
    flex: 1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: 72,
    height: 72,
  },
  buttonText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
    alignSelf: 'center',
    marginTop: 10,
  },
  imageContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: '25%',
    height: undefined,
    aspectRatio: 3,
  },
  topText: {
    fontSize: 28,
    marginTop: 12,
  },
  closeIcon: {
    width: 17,
    height: 17,
  },
});

export default Confirming;
