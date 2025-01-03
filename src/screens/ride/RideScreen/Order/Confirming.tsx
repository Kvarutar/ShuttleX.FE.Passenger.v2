import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Bar, BarModes, CloseIcon, Fog, sizes, Text, useTariffsIcons, useTheme } from 'shuttlex-integration';

import { setActiveBottomWindowYCoordinate } from '../../../../core/passenger/redux';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { cancelOffer } from '../../../../core/ride/redux/offer/thunks';

const Confirming = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [dotsCounter, setDotsCounter] = useState(3);
  const dispatch = useAppDispatch();
  const tariffsIconsData = useTariffsIcons();

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

  return (
    <>
      <Fog />
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <TariffImage style={styles.image} />
          <Text style={styles.topText}>
            {t('ride_Ride_Confirming_searchDrivers', { dots: '.'.repeat(dotsCounter) })}
          </Text>
        </View>
        <View style={computedStyles.closeButtonContainer}>
          <Bar
            mode={BarModes.Disabled}
            style={[styles.button, computedStyles.button]}
            onPress={() => dispatch(cancelOffer())}
          >
            <CloseIcon style={styles.closeIcon} />
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
