export type OrderRef = {
  openAddressSelect: () => void;
};

//TODO: swap DefaultPaymentMethodsType to paymentMethods from BE
// export type DefaultPaymentMethodsType = 'cash' | 'applepay' | 'paypal' | 'crypto' | 'card';
export type DefaultPaymentMethodsType = 'cash' | 'crypto' | 'card';
