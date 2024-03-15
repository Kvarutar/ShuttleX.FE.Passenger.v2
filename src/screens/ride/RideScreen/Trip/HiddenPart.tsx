import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Bar,
  Button,
  ButtonModes,
  ChatIcon,
  EmergencyServiceIcon,
  PassengerIcon,
  PhoneIcon,
  ReportIcon,
  sizes,
  SwipeButton,
  SwipeButtonModes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { endTrip } from '../../../../core/ride/redux/trip';
import { TripOrderSelector } from '../../../../core/ride/redux/trip/selectors';
import { TripOrder } from '../../../../core/ride/redux/trip/types';

const HiddenPart = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const trip = useSelector(TripOrderSelector);

  const computedStyles = StyleSheet.create({
    separator: {
      borderColor: colors.strokeColor,
    },
  });

  const onCancelTrip = () => {
    dispatch(endTrip());
  };

  if (!trip) {
    return <></>;
  }

  return (
    <>
      <ContactInfo trip={trip} />
      <Bar style={styles.hiddenTotal}>
        <Text style={styles.hiddenTotalTitle}>{t('ride_Ride_Trip_totalForRide')}</Text>
        <Text style={styles.hiddenTotalContent}>{trip.total}</Text>
      </Bar>
      <View style={styles.hiddenSafety}>
        <Pressable style={styles.hiddenSafetyItem} onPress={() => Linking.openURL('tel:911')}>
          <Bar style={styles.hiddenSafetyItemIcon}>
            <EmergencyServiceIcon />
          </Bar>
          <Text style={styles.hiddenSafetyItemText}>{t('ride_Ride_Trip_contactEmergency')}</Text>
        </Pressable>
        <Pressable style={styles.hiddenSafetyItem}>
          <Bar style={styles.hiddenSafetyItemIcon}>
            <ReportIcon />
          </Bar>
          <Text style={styles.hiddenSafetyItemText}>{t('ride_Ride_Trip_reportIssue')}</Text>
        </Pressable>
      </View>
      <View style={styles.horizontalSeparatorWrapper}>
        <View style={[styles.horizontalSeparator, computedStyles.separator]} />
      </View>
      <SwipeButton
        mode={SwipeButtonModes.Decline}
        onSwipeEnd={onCancelTrip}
        text={t('ride_Ride_Trip_cancelRideButton')}
      />
    </>
  );
};

const ContactInfo = ({ trip }: { trip: TripOrder }) => {
  const { colors } = useTheme();

  return (
    <Bar style={styles.bar}>
      <View style={styles.hiddenPassengerInfo}>
        <PassengerIcon style={styles.passengerBigIcon} color={colors.iconPrimaryColor} />
        <Text style={styles.hiddenPassengerInfoName}>{trip.contractor.name}</Text>
      </View>
      <View style={styles.hiddenContactButtons}>
        <Button style={styles.hiddenContactButton} containerStyle={styles.hiddenContactButtonContainer}>
          <ChatIcon />
        </Button>
        <Button
          style={styles.hiddenContactButton}
          containerStyle={styles.hiddenContactButtonContainer}
          mode={ButtonModes.Mode3}
          onPress={() => Linking.openURL(`tel:${trip.contractor.phone}`)}
        >
          <PhoneIcon />
        </Button>
      </View>
    </Bar>
  );
};

const styles = StyleSheet.create({
  bar: {
    marginBottom: 30,
  },
  hiddenPassengerInfo: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
    gap: 4,
  },
  hiddenPassengerInfoName: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
  },
  hiddenContactButtons: {
    flexDirection: 'row',
    gap: 18,
  },
  hiddenContactButtonContainer: {
    flex: 1,
  },
  hiddenTripType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 30,
    paddingHorizontal: 16,
  },
  hiddenTripTypeTitle: {
    fontFamily: 'Inter Medium',
  },
  hiddenTripTypeContent: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  hiddenTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  hiddenTotalTitle: {
    fontFamily: 'Inter Medium',
  },
  hiddenTotalContent: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  hiddenSafety: {
    flexDirection: 'row',
    gap: 14,
  },
  hiddenSafetyItem: {
    flex: 1,
  },
  hiddenSafetyItemIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenSafetyItemText: {
    textAlign: 'center',
    fontFamily: 'Inter Medium',
    fontSize: 12,
    marginTop: 6,
  },
  hiddenContactButton: {
    height: 48,
  },
  passengerBigIcon: {
    width: sizes.iconSize,
    height: sizes.iconSize,
  },
  smallPhoneButton: {
    paddingHorizontal: 0,
    width: 34,
    height: 34,
  },
  smallPhoneButtonIcon: {
    width: 16,
    height: 16,
  },
  horizontalSeparatorWrapper: {
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 20,
  },
  horizontalSeparator: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: -0.5,
  },
});

export default HiddenPart;
