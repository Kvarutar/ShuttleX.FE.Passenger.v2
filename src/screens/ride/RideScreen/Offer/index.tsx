import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BottomWindow } from 'shuttlex-integration';

import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { OfferStatusSelector } from '../../../../core/ride/redux/offer/selectors';
import { OfferStatus } from '../../../../core/ride/redux/offer/types';
import { RootStackParamList } from '../../../../Navigate/props';
import AlertsInitializer from '../../../../shared/AlertsInitializer';
import PaymentPopup from '../PaymentPopup';
import Confirming from './Confirming';
import OfferCreationError from './OfferCreationError';
import StartRide from './StartRide';
import TariffsCarousel from './TariffsCarousel_v2';

const Offer = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Ride', undefined> }) => {
  const currentOfferStatus = useSelector(OfferStatusSelector);
  const { t } = useTranslation();

  const OfferStatusComponents: Record<OfferStatus, ReactNode | null> = {
    startRide: <StartRide />,
    choosingTariff: null,
    confirming: null,
    confirmation: <Confirming onCancel={() => {}} />,
    noDrivers: <OfferCreationError error={t('ride_Ride_Offer_noDriversAvaliable')} />,
    rideUnavaliable: <OfferCreationError error={t('ride_Ride_Offer_rideIsUnavaliable')} />,
  };

  const alerts = useSelector(twoHighestPriorityAlertsSelector);

  if (currentOfferStatus === OfferStatus.ChoosingTariff) {
    return <TariffsCarousel />;
  }

  if (currentOfferStatus === OfferStatus.Confirming) {
    return <PaymentPopup navigation={navigation} />;
  }

  return (
    <BottomWindow
      alerts={alerts.map(alertData => (
        <AlertsInitializer
          key={alertData.id}
          id={alertData.id}
          priority={alertData.priority}
          type={alertData.type}
          options={'options' in alertData ? alertData.options : undefined}
        />
      ))}
    >
      {OfferStatusComponents[currentOfferStatus]}
    </BottomWindow>
  );
};

export default Offer;
