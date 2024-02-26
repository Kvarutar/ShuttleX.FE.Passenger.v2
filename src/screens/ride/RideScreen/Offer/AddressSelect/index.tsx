import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import { getLocales } from 'react-native-localize';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonModes,
  DatePicker,
  GroupedButtons,
  PlusIcon,
  ScrollViewWithCustomScroll,
  TimePicker,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { addOfferPoint, removeOfferPoint, setOfferStatus } from '../../../../../core/ride/redux/offer';
import { OfferPointsSelector } from '../../../../../core/ride/redux/offer/selectors';
import { OfferStatus } from '../../../../../core/ride/redux/offer/types';
import AddressPopup from './AddressPopup';
import PointItem from './PointItem';
import { AddressSelectProps, PointMode } from './props';

const windowHeight = Dimensions.get('window').height;
const fadeAnimationDuration = 100;

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat(getLocales()[0].languageTag, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);

const formatTime = (time: Date): string =>
  new Intl.DateTimeFormat(getLocales()[0].languageTag, {
    hour: 'numeric',
    minute: 'numeric',
  }).format(time);

const minimumDate = new Date();

const AddressSelect = ({ navigation, closeAddressSelect, addressSelectMode }: AddressSelectProps) => {
  const [isFirstButtonSelected, setIsFirstButtonSelected] = useState(addressSelectMode === 'now');
  const [pointId, setPointId] = useState(2);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const points = useSelector(OfferPointsSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    setSelectedTime(null);
    setSelectedDate(null);
  }, [isFirstButtonSelected]);

  useEffect(() => {
    const isAllAddressesFilled = !points.some(el => el.address === '');
    if (isFirstButtonSelected) {
      setShowConfirmButton(isAllAddressesFilled);
    } else if (isAllAddressesFilled && selectedDate && selectedTime) {
      setShowConfirmButton(true);
    } else {
      setShowConfirmButton(false);
    }
  }, [points, selectedDate, selectedTime, isFirstButtonSelected]);

  const pointsContent = points.map((point, index) => {
    let pointMode: PointMode = 'default';

    if (index === 0) {
      pointMode = 'pickUp';
    } else if (index === points.length - 1) {
      pointMode = 'dropOff';
    }

    return (
      <Pressable key={point.id} onPress={() => navigation.navigate('AddressSelection', { offerPointId: point.id })}>
        <PointItem
          pointMode={pointMode}
          content={point.address}
          currentPointId={point.id}
          onRemovePoint={points.length > 2 && index !== 0 ? () => onRemovePoint(point.id) : undefined}
        />
      </Pressable>
    );
  });

  const onRemovePoint = (id: number) => {
    dispatch(removeOfferPoint(id));
  };

  const onAddPoint = () => {
    dispatch(
      addOfferPoint({
        id: pointId,
        address: '',
      }),
    );

    setPointId(prevPointId => prevPointId + 1);
  };

  const onConfirm = () => {
    closeAddressSelect();
    dispatch(setOfferStatus(OfferStatus.ChoosingTariff));
  };

  return (
    <AddressPopup
      onBackButtonPress={closeAddressSelect}
      additionalTopButtons={
        <GroupedButtons
          style={styles.groupedButtons}
          firstTextButton={t('ride_Ride_AddressSelect_firstButton')}
          secondTextButton={t('ride_Ride_AddressSelect_secondButton')}
          isFirstButtonSelected={isFirstButtonSelected}
          setIsFirstButtonSelected={setIsFirstButtonSelected}
        />
      }
      barStyle={styles.barStyle}
      showConfirmButton={showConfirmButton}
      onConfirm={onConfirm}
    >
      {!isFirstButtonSelected && (
        <Animated.View
          entering={FadeIn.duration(fadeAnimationDuration)}
          exiting={FadeOut.duration(fadeAnimationDuration)}
          style={styles.delayedTrip}
        >
          <TimePicker
            onTimeSelect={(time: Date) => setSelectedTime(time)}
            style={styles.dateTimePicker}
            placeholder={t('ride_Ride_AddressSelect_timePickerPlaceholder')}
            formatTime={formatTime}
          />
          <DatePicker
            onDateSelect={(date: Date) => setSelectedDate(date)}
            style={styles.dateTimePicker}
            placeholder={t('ride_Ride_AddressSelect_datePickerPlaceholder')}
            formatDate={formatDate}
            minimumDate={minimumDate}
          />
        </Animated.View>
      )}
      <ScrollViewWithCustomScroll
        style={styles.scrollView}
        contentContainerStyle={styles.pointsWrapper}
        barStyle={styles.scrollBar}
      >
        {pointsContent}
      </ScrollViewWithCustomScroll>
      {points.length < 5 && (
        <Button mode={ButtonModes.Mode4} style={styles.button} buttonStyle={styles.buttonStyle} onPress={onAddPoint}>
          <PlusIcon />
        </Button>
      )}
    </AddressPopup>
  );
};

const styles = StyleSheet.create({
  groupedButtons: {
    alignSelf: 'flex-end',
  },
  scrollView: {
    maxHeight: windowHeight * 0.5,
  },
  delayedTrip: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  pointsWrapper: {
    gap: 10,
  },
  scrollBar: {
    top: 0,
  },
  button: {
    marginTop: 16,
  },
  buttonStyle: {
    paddingVertical: 14,
  },
  barStyle: {
    marginTop: 32,
  },
  dateTimePicker: {
    flex: 1,
  },
});

export default AddressSelect;
