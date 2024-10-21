import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import { CloseIcon, PointIcon, PointIcon2, TextInput, TextInputInputMode, useTheme } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { updateOrderPoint } from '../../../../../../core/ride/redux/order';
import { orderPointsSelector } from '../../../../../../core/ride/redux/order/selectors';
import { PointItemProps } from './types';

const fadeAnimationDuration = 100;

const PointItem = ({ style, pointMode, currentPointId, setFocusedInput }: PointItemProps) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const points = useSelector(orderPointsSelector);
  const currentPoint = points.find(point => point.id === currentPointId);

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isInputTouched, setIsInputTouched] = useState(false);

  const shadowOptions = {
    distance: isFocused ? 8 : 0,
    startColor: isFocused ? '#00000012' : 'transparent',
  };

  useEffect(() => {
    if (isFocused) {
      setIsInputTouched(true);
    }
  }, [setIsInputTouched, isFocused]);

  useEffect(() => {
    if (isInputTouched) {
      setFocusedInput({ id: currentPointId, value: inputValue, focus: isFocused });
    }
  }, [currentPointId, inputValue, isFocused, isInputTouched, setFocusedInput]);

  useEffect(() => {
    if (currentPoint?.address && !isFocused) {
      setInputValue(currentPoint.address);
    }
  }, [currentPoint?.address, isFocused]);

  useEffect(() => {
    if (!inputValue.length) {
      dispatch(updateOrderPoint({ id: currentPointId, address: '', longitude: 0, latitude: 0 }));
    }
  }, [currentPointId, dispatch, inputValue]);

  const computedStyles = StyleSheet.create({
    inputContent: {
      backgroundColor: isFocused || inputValue ? colors.backgroundPrimaryColor : colors.backgroundSecondaryColor,
    },
    dots: {
      backgroundColor: colors.iconSecondaryColor,
    },
  });

  const pointIcon = ({ innerColor, outerColor }: { innerColor?: string; outerColor?: string }) => {
    if (isFocused || inputValue) {
      return <PointIcon innerColor={innerColor} outerColor={outerColor} />;
    }

    return <PointIcon2 />;
  };

  const isFocusedHandler = (state: boolean) => () => setIsFocused(state);
  const clearInputValue = () => {
    dispatch(updateOrderPoint({ id: currentPointId, address: '', longitude: 0, latitude: 0 }));
    setInputValue('');
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
            pointIcon({ innerColor: colors.backgroundSecondaryColor, outerColor: colors.errorColor })
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
          placeholder={t('ride_Ride_AddressSelect_addressInputPlaceholder')}
          wrapperStyle={styles.inputContainer}
          containerStyle={styles.input}
          inputMode={TextInputInputMode.Text}
          onChangeText={setInputValue}
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
