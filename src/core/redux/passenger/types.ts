export type PaymentMethodType = {
  method: 'visa' | 'mastercard' | 'applepay' | 'paypal';
  details: string;
};

export type PassengerState = {
  payment: {
    selectedMethod: PaymentMethodType | null;
    allMethods: PaymentMethodType[] | null;
  };
};
