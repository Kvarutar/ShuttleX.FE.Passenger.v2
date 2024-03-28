import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Bar,
  BarModes,
  Button,
  ButtonModes,
  DropOffIcon,
  InputXIcon,
  LocationIcon,
  MinusIcon,
  PickUpIcon,
  Text,
  TextInput,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { updateOrderPoint } from '../../../../../core/ride/redux/order';
import { PointItemProps } from './props';

const fadeAnimationDuration = 100;

const PointItem = ({ pointMode, content, onRemovePoint, currentPointId }: PointItemProps) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const computedStyles = StyleSheet.create({
    line: {
      backgroundColor: colors.iconSecondaryColor,
    },
  });

  return (
    <Animated.View
      style={styles.inputWrapper}
      entering={FadeIn.duration(fadeAnimationDuration)}
      exiting={FadeOut.duration(fadeAnimationDuration)}
    >
      <View style={styles.inputContent}>
        {pointMode === 'dropOff' ? (
          <DropOffIcon />
        ) : (
          <PickUpIcon color={pointMode === 'pickUp' ? colors.iconPrimaryColor : undefined} />
        )}
        <View style={styles.input}>
          {content ? (
            <Bar style={styles.bar} mode={BarModes.Active}>
              <Text numberOfLines={1} style={styles.barText}>
                {content}
              </Text>
              <View style={styles.barButtons}>
                <Pressable hitSlop={20} onPress={() => dispatch(updateOrderPoint({ id: currentPointId, address: '' }))}>
                  <InputXIcon />
                </Pressable>
                <View style={[styles.line, computedStyles.line]} />
                <Pressable hitSlop={20} onPress={() => {}}>
                  <LocationIcon />
                </Pressable>
              </View>
            </Bar>
          ) : (
            <View style={styles.textInputWrapper}>
              <TextInput placeholder={t('ride_Ride_AddressSelect_addressInputPlaceholder')} editable={false} />
              <View style={styles.inputButtons}>
                <View style={[styles.line, computedStyles.line]} />
                <Pressable hitSlop={20} onPress={() => {}}>
                  <LocationIcon />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
      {onRemovePoint && (
        <Button mode={ButtonModes.Mode2} style={styles.removePointButton} onPress={onRemovePoint}>
          <MinusIcon />
        </Button>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContent: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flex: 1,
  },
  input: {
    flex: 1,
  },
  bar: {
    paddingLeft: 30,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  barText: {
    flexShrink: 1,
  },
  barButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  line: {
    width: 1,
    height: '100%',
  },
  textInputWrapper: {
    position: 'relative',
  },
  inputButtons: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    right: 20,
    top: 18,
  },
  removePointButton: {
    borderRadius: 100,
    width: 28,
    height: 28,
    paddingHorizontal: 0,
  },
});

export default PointItem;
