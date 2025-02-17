import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import { CloseIcon, PointIcon, PointIcon2, TextInput, TextInputInputMode, useTheme } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { geolocationCoordinatesSelector } from '../../../../../../core/ride/redux/geolocation/selectors';
import { updateOfferPoint } from '../../../../../../core/ride/redux/offer';
import { offerPointByIdSelector, offerPointsSelector } from '../../../../../../core/ride/redux/offer/selectors';
import { createPhantomOffer, getAvailableTariffs } from '../../../../../../core/ride/redux/offer/thunks';
import { PointItemProps } from './types';

const fadeAnimationDuration = 100;

const PointItem = ({ style, pointMode, currentPointId, updateFocusedInput, isInFocus, onFocus }: PointItemProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const point = useSelector(state => offerPointByIdSelector(state, currentPointId));
  const defaultLocation = useSelector(geolocationCoordinatesSelector);
  const offerPoints = useSelector(offerPointsSelector);

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (point && !isFocused && point.latitude) {
      const isPresentAddressInFullAddress = point.fullAddress.includes(point.address);
      const content = isPresentAddressInFullAddress ? point.fullAddress : point.address;
      setInputValue(content);
    }
  }, [point, isFocused]);

  useEffect(() => {
    if (currentPointId === 0 && !isInFocus && defaultLocation && point?.fullAddress === '') {
      dispatch(
        updateOfferPoint({
          id: 0,
          address: '',
          fullAddress: t('ride_Ride_AddressSelect_addressInputMyLocation'),
          longitude: defaultLocation.longitude,
          latitude: defaultLocation.latitude,
        }),
      );

      const newFocusedPoint = offerPoints.find(el => el.id !== 0 && el.address === '');
      if (newFocusedPoint) {
        updateFocusedInput({ id: newFocusedPoint.id, value: '', focus: false });
      }
    }
  }, [currentPointId, defaultLocation, dispatch, isInFocus, point, t, offerPoints, updateFocusedInput]);

  useEffect(() => {
    if (currentPointId === 0 && !isFocused && point?.latitude && point?.longitude) {
      (async () => {
        await dispatch(getAvailableTariffs({ latitude: point.latitude, longitude: point.longitude }));
        dispatch(createPhantomOffer());
      })();
    }
  }, [isFocused, point, currentPointId, dispatch]);

  const isFocusedHandler = (state: boolean) => () => {
    onFocus?.();
    if (!state && point && !point?.address) {
      dispatch(updateOfferPoint({ id: point?.id, address: '', fullAddress: '', longitude: 0, latitude: 0 }));
      if (!defaultLocation) {
        setInputValue('');
      }
    }
    updateFocusedInput({ id: currentPointId, value: inputValue, focus: state });
    setIsFocused(state);

    if (state && point?.id === 0 && point.fullAddress === t('ride_Ride_AddressSelect_addressInputMyLocation')) {
      clearInputValue();
    }
  };

  const clearInputValue = () => {
    setInputValue('');
    updateFocusedInput({ id: currentPointId, value: '', focus: isFocused });
    dispatch(updateOfferPoint({ id: currentPointId, address: '', fullAddress: '', longitude: 0, latitude: 0 }));
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    updateFocusedInput({ id: currentPointId, value: value, focus: isFocused });
    if (point) {
      dispatch(updateOfferPoint({ ...point, fullAddress: value, longitude: 0, latitude: 0 }));
    }
  };

  const getColorInput = () => {
    if (isInFocus) {
      return colors.backgroundPrimaryColor;
    }

    return colors.backgroundSecondaryColor;
  };

  const computedStyles = StyleSheet.create({
    inputContent: {
      backgroundColor: getColorInput(),
    },
    dots: {
      backgroundColor: colors.iconSecondaryColor,
    },
  });

  const shadowOptions = {
    distance: isInFocus ? 8 : 0,
    startColor: isInFocus ? colors.strongShadowColor : 'transparent',
  };

  const pointIcon = ({ innerColor, outerColor }: { innerColor?: string; outerColor?: string }) => {
    if (isInFocus || inputValue) {
      return (
        <Animated.View>
          <PointIcon innerColor={innerColor} outerColor={outerColor} />
        </Animated.View>
      );
    }

    return (
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeIn.duration(200)}>
        <PointIcon2 />
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={style}
      entering={FadeIn.duration(fadeAnimationDuration)}
      exiting={FadeOut.duration(fadeAnimationDuration)}
    >
      <Shadow {...shadowOptions} style={[styles.inputContent, computedStyles.inputContent]}>
        <View style={styles.iconContainer}>
          {pointMode === 'dropOff' ? (
            pointIcon({
              innerColor: colors.backgroundSecondaryColor,
              outerColor: colors.errorColor,
            })
          ) : (
            <>
              {pointIcon({})}
              <View style={styles.dotsContainer}>
                {[1, 2, 3].map(dot => (
                  <View key={`dot_${dot}`} style={[styles.dots, computedStyles.dots]} />
                ))}
              </View>
            </>
          )}
        </View>
        <TextInput
          placeholder={
            currentPointId === 1
              ? t('ride_Ride_AddressSelect_addressWhereInputPlaceholder')
              : t('ride_Ride_AddressSelect_addressFromInputPlaceholder')
          }
          wrapperStyle={styles.inputContainer}
          inputStyle={{ color: colors.textPrimaryColor }}
          containerStyle={styles.input}
          inputMode={TextInputInputMode.Text}
          onChangeText={handleInputChange}
          value={inputValue}
          onFocus={isFocusedHandler(true)}
          onBlur={isFocusedHandler(false)}
        />
        {inputValue && isInFocus && (
          <Pressable onPress={clearInputValue} style={styles.cleanInputIcon} hitSlop={20}>
            <CloseIcon color={colors.textSecondaryColor} />
          </Pressable>
        )}
      </Shadow>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    height: 21,
    justifyContent: 'space-between',
    bottom: -10.5,
  },
  dots: {
    borderRadius: 100,
    width: 3,
    height: 3,
    backgroundColor: 'red',
  },
  cleanInputIcon: {
    marginRight: 16,
    marginLeft: 10,
  },
});

export default PointItem;
