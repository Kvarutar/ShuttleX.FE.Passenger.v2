import { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { orderStatusSelector } from '../../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../../core/ride/redux/order/types';
import Confirming from './Confirming';
import PaymentPopup from './PaymentPopup';
import StartRide from './StartRide';
import { StartRideRef } from './StartRide/props';
import Tariffs from './Tariffs';
import { OrderRef } from './types';

const Order = forwardRef<OrderRef>(({}, ref) => {
  const startRideRef = useRef<StartRideRef>(null);

  const currentOrderStatus = useSelector(orderStatusSelector);
  const [isAddressSelectVisible, setIsAddressSelectVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    openAddressSelect: () => {
      startRideRef.current?.openAddressSelect();
    },
  }));

  const OrderStatusComponents: Record<OrderStatus, ReactNode | null> = {
    startRide: (
      <StartRide
        ref={startRideRef}
        isAddressSelectVisible={isAddressSelectVisible}
        setIsAddressSelectVisible={setIsAddressSelectVisible}
      />
    ),
    choosingTariff: <Tariffs setIsAddressSelectVisible={setIsAddressSelectVisible} />,
    payment: <PaymentPopup />,
    confirming: <Confirming />,
    noDrivers: null,
    rideUnavailable: null,
  };

  return OrderStatusComponents[currentOrderStatus];
});

export default Order;
