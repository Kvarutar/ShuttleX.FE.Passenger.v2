import { PaymentMethod } from 'shuttlex-integration';

export type Profile = {
  imageUri: string;
  name: string;
  surname: string;
};

export type PassengerState = {
  payment: {
    selectedMethod: PaymentMethod | null;
    avaliableMethods: PaymentMethod[];
  };
  profile: Profile | null;
};
