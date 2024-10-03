import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { BottomWindowWithGesture, BottomWindowWithGestureRef } from 'shuttlex-integration';

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
import { PlaceType } from './PlaceBar/props';
import StartRideHidden from './StartRide/StartRideHidden';
import StartRideVisible from './StartRide/StartRideVisible';
import Tariffs from './Tariffs';

const Order = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Ride', undefined> }) => {
  const currentOrderStatus = useSelector(orderStatusSelector);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const addressSelectRef = useRef<BottomWindowWithGestureRef>(null);

  const [isAddressSelectVisible, setIsAddressSelectVisible] = useState(false);
  const [isBottomWindowOpen, setIsBottomWindowOpen] = useState(false);
  const [fastAddressSelect, setFastAddressSelect] = useState<PlaceType | null>(null);

  useEffect(() => {
    if (isAddressSelectVisible) {
      addressSelectRef.current?.openWindow();
    } else {
      dispatch(cleanOrderPoints());
      setFastAddressSelect(null);
    }
  }, [dispatch, isAddressSelectVisible]);

  const OrderStatusComponents: Record<OrderStatus, ReactNode | null> = {
    startRide: (
      <StartRideVisible
        openAddressSelect={setIsAddressSelectVisible}
        isBottomWindowOpen={isBottomWindowOpen}
        setFastAddressSelect={setFastAddressSelect}
      />
    ),
    choosingTariff: null,
    confirming: null,
    confirmation: <Confirming />,
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
      <BottomWindowWithGesture
        visiblePart={OrderStatusComponents[currentOrderStatus]}
        setIsOpened={setIsBottomWindowOpen}
        hiddenPart={<StartRideHidden />}
        hiddenPartStyle={styles.hiddenPartStyle}
        hiddenPartContainerStyle={styles.hiddenPartContainerStyle}
        alerts={alerts.map(alertData => (
          <AlertInitializer
            key={alertData.id}
            id={alertData.id}
            priority={alertData.priority}
            type={alertData.type}
            options={'options' in alertData ? alertData.options : undefined}
          />
        ))}
      />
      {isAddressSelectVisible && (
        <BottomWindowWithGesture
          hiddenPart={
            <AddressSelect setIsAddressSelectVisible={setIsAddressSelectVisible} address={fastAddressSelect} />
          }
          setIsOpened={setIsAddressSelectVisible}
          ref={addressSelectRef}
          hiddenPartStyle={styles.hiddenPartStyleAddressSelect}
          withHiddenPartScroll={false}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  hiddenPartStyle: {
    marginTop: 0,
  },
  hiddenPartContainerStyle: {
    paddingTop: 0,
  },
  hiddenPartStyleAddressSelect: {
    height: '100%',
  },
});

export default Order;
