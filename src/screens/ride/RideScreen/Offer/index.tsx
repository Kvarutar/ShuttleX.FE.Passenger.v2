import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BottomWindow } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { clearOfferPoints } from '../../../../core/ride/redux/offer';
import { OfferStatusSelector } from '../../../../core/ride/redux/offer/selectors';
import { OfferStatus } from '../../../../core/ride/redux/offer/types';
import { RootStackParamList } from '../../../../Navigate/props';
import AlertInitializer from '../../../../shared/AlertInitializer';
import PaymentPopup from '../PaymentPopup';
import AddressSelect from './AddressSelect';
import { AddressSelectMode } from './AddressSelect/props';
import Confirming from './Confirming';
import OfferCreationError from './OfferCreationError';
import StartRide from './StartRide';
import TariffsCarousel from './TariffsCarousel_v2';

const Offer = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Ride', undefined> }) => {
  const currentOfferStatus = useSelector(OfferStatusSelector);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isAddressSelectVisible, setIsAddressSelectVisible] = useState(false);
  const [addressSelectMode, setAddressSelectMode] = useState<AddressSelectMode>('now');

  const openAddressSelect = (mode: AddressSelectMode) => {
    setIsAddressSelectVisible(true);
    setAddressSelectMode(mode);
  };

  const OfferStatusComponents: Record<OfferStatus, ReactNode | null> = {
    startRide: <StartRide openAddressSelect={openAddressSelect} />,
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

  const closeAddressSelect = () => {
    setIsAddressSelectVisible(false);
    dispatch(clearOfferPoints());
  };

  return (
    <>
      <BottomWindow
        alerts={alerts.map(alertData => (
          <AlertInitializer
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
      {isAddressSelectVisible && (
        <AddressSelect
          addressSelectMode={addressSelectMode}
          navigation={navigation}
          closeAddressSelect={closeAddressSelect}
        />
      )}
    </>
  );
};

export default Offer;
