import { forwardRef, ReactNode, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';

import { orderStatusSelector } from '../../../../core/ride/redux/order/selectors';
import { OrderStatus } from '../../../../core/ride/redux/order/types';
import Confirming from './Confirming';
import PaymentPopup from './popups/PaymentPopup';
import StartRide from './StartRide';
import { StartRideRef } from './StartRide/types';
import Tariffs from './Tariffs';
import { OrderRef } from './types';

const Order = forwardRef<OrderRef>(({}, ref) => {
  const startRideRef = useRef<StartRideRef>(null);

  const currentOrderStatus = useSelector(orderStatusSelector);

  useImperativeHandle(ref, () => ({
    openAddressSelect: () => {
      startRideRef.current?.openAddressSelect();
    },
  }));

  const OrderStatusComponents: Record<OrderStatus, ReactNode | null> = {
    startRide: <StartRide ref={startRideRef} />,
    choosingTariff: <Tariffs />,
    payment: <PaymentPopup />,
    confirming: <Confirming />,
    noDrivers: <Confirming />,
    rideUnavailable: null,
  };

  return OrderStatusComponents[currentOrderStatus];
});

export default Order;
