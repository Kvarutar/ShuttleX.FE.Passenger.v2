import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { BottomWindow, BottomWindowWithGesture, BottomWindowWithGestureRef } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { cleanOrderPoints } from '../../../../core/ride/redux/order';
import { orderStatusSelector } from '../../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../../core/ride/redux/order/types';
import { RootStackParamList } from '../../../../Navigate/props';
import AlertInitializer from '../../../../shared/AlertInitializer';
import PaymentPopup from '../PaymentPopup';
import AddressSelect from './AddressSelect';
import Confirming from './Confirming';
import OrderCreationError from './OrderCreationError';
import StartRide from './StartRide';
import Tariffs from './Tariffs';

const Order = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Ride', undefined> }) => {
  const currentOrderStatus = useSelector(orderStatusSelector);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const addressSelectRef = useRef<BottomWindowWithGestureRef>(null);

  const [isAddressSelectVisible, setIsAddressSelectVisible] = useState(false);

  const openAddressSelect = () => {
    setIsAddressSelectVisible(true);
  };

  useEffect(() => {
    if (isAddressSelectVisible) {
      addressSelectRef.current?.openWindow();
    } else {
      dispatch(cleanOrderPoints());
    }
  }, [dispatch, isAddressSelectVisible]);

  const OrderStatusComponents: Record<OrderStatus, ReactNode | null> = {
    startRide: <StartRide openAddressSelect={openAddressSelect} />,
    choosingTariff: null,
    confirming: null,
    confirmation: <Confirming onCancel={() => {}} />,
    noDrivers: <OrderCreationError error={t('ride_Ride_Order_noDriversAvaliable')} />,
    rideUnavaliable: <OrderCreationError error={t('ride_Ride_Order_rideIsUnavaliable')} />,
  };

  const alerts = useSelector(twoHighestPriorityAlertsSelector);

  if (currentOrderStatus === OrderStatus.ChoosingTariff) {
    return <Tariffs setIsAddressSelectVisible={setIsAddressSelectVisible} />;
  }

  if (currentOrderStatus === OrderStatus.Confirming) {
    return <PaymentPopup navigation={navigation} />;
  }

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
        <BottomWindowWithGesture
          hiddenPart={<AddressSelect setIsAddressSelectVisible={setIsAddressSelectVisible} />}
          setIsOpened={setIsAddressSelectVisible}
          ref={addressSelectRef}
          hiddenPartStyle={styles.hiddenPartStyle}
          withHiddenPartScroll={false}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  hiddenPartStyle: {
    height: '100%',
  },
});

export default Order;
