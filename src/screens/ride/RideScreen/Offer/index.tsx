import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BottomWindow } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { clearOrderPoints } from '../../../../core/ride/redux/order';
import { OrderStatusSelector } from '../../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../../core/ride/redux/order/types';
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
  const currentOrderStatus = useSelector(OrderStatusSelector);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isAddressSelectVisible, setIsAddressSelectVisible] = useState(false);
  const [addressSelectMode, setAddressSelectMode] = useState<AddressSelectMode>('now');

  const openAddressSelect = (mode: AddressSelectMode) => {
    setIsAddressSelectVisible(true);
    setAddressSelectMode(mode);
  };

  const OrderStatusComponents: Record<OrderStatus, ReactNode | null> = {
    startRide: <StartRide openAddressSelect={openAddressSelect} />,
    choosingTariff: null,
    confirming: null,
    confirmation: <Confirming onCancel={() => {}} />,
    noDrivers: <OfferCreationError error={t('ride_Ride_Offer_noDriversAvaliable')} />,
    rideUnavaliable: <OfferCreationError error={t('ride_Ride_Offer_rideIsUnavaliable')} />,
  };

  const alerts = useSelector(twoHighestPriorityAlertsSelector);

  if (currentOrderStatus === OrderStatus.ChoosingTariff) {
    return <TariffsCarousel />;
  }

  if (currentOrderStatus === OrderStatus.Confirming) {
    return <PaymentPopup navigation={navigation} />;
  }

  const closeAddressSelect = () => {
    setIsAddressSelectVisible(false);
    dispatch(clearOrderPoints());
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
        {OrderStatusComponents[currentOrderStatus]}
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
