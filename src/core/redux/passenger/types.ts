import { PaymentMethod } from 'shuttlex-integration';

export type PassengerState = {
  payment: {
    selectedMethod: PaymentMethod | null;
    avaliableMethods: PaymentMethod[];
  };
};
