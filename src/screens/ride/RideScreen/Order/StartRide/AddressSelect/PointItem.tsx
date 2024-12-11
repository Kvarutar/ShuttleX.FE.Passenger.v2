import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import { CloseIcon, PointIcon, PointIcon2, TextInput, TextInputInputMode, useTheme } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { updateOfferPoint } from '../../../../../../core/ride/redux/offer';
import { offerPointByIdSelector } from '../../../../../../core/ride/redux/offer/selectors';
import { createPhantomOffer, getAvailableTariffs } from '../../../../../../core/ride/redux/offer/thunks';
import { PointItemProps } from './types';

const fadeAnimationDuration = 100;

const PointItem = ({ style, pointMode, currentPointId, updateFocusedInput }: PointItemProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const point = useSelector(offerPointByIdSelector(currentPointId));

  const [inputValue, setInputValue] = useState(point?.address ?? '');
  const [isFocused, setIsFocused] = useState(false);
  const hasEffectRun = useRef(false);

  useEffect(() => {
    if (point?.address !== inputValue) {
      setInputValue(point?.address ?? '');
    }
  }, [point?.address, inputValue]);

  useEffect(() => {
    if (!hasEffectRun.current && currentPointId === 0 && point?.address) {
      (async () => {
        await dispatch(getAvailableTariffs({ latitude: point.latitude, longitude: point.longitude }));
        dispatch(createPhantomOffer());
        hasEffectRun.current = true;
      })();
    }
  }, [currentPointId, dispatch, point]);

  const isFocusedHandler = (state: boolean) => () => {
    updateFocusedInput({ id: currentPointId, value: inputValue, focus: state });
    setIsFocused(state);
  };

  const clearInputValue = () => {
    updateFocusedInput({ id: currentPointId, value: '', focus: isFocused });
    dispatch(updateOfferPoint({ id: currentPointId, address: '', fullAddress: '', longitude: 0, latitude: 0 }));
  };

  const handleInputChange = (value: string) => {
    updateFocusedInput({ id: currentPointId, value: value, focus: isFocused });
    if (point) {
      dispatch(updateOfferPoint({ ...point, address: value, longitude: 0, latitude: 0 }));
    }
  };

  const computedStyles = StyleSheet.create({
    inputContent: {
      backgroundColor: isFocused || inputValue ? colors.backgroundPrimaryColor : colors.backgroundSecondaryColor,
    },
    dots: {
      backgroundColor: colors.iconSecondaryColor,
    },
  });

  const shadowOptions = {
    distance: isFocused ? 8 : 0,
    startColor: isFocused ? colors.strongShadowColor : 'transparent',
  };

  const pointIcon = ({ innerColor, outerColor }: { innerColor?: string; outerColor?: string }) => {
    if (isFocused || inputValue) {
      return <PointIcon innerColor={innerColor} outerColor={outerColor} />;
    }

    return <PointIcon2 />;
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
          inputStyle={{ color: isFocused || point?.latitude ? colors.textPrimaryColor : colors.errorColor }}
          containerStyle={styles.input}
          inputMode={TextInputInputMode.Text}
          onChangeText={handleInputChange}
          value={inputValue}
          onFocus={isFocusedHandler(true)}
          onBlur={isFocusedHandler(false)}
        />
        {inputValue && isFocused && (
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
