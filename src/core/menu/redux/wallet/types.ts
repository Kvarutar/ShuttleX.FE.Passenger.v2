import { PaymentMethod } from 'shuttlex-integration';

export type WalletState = {
  payment: {
    selectedMethod: PaymentMethod | null;
    avaliableMethods: PaymentMethod[];
  };
};
