export type RootStackParamList = {
  Splash: undefined;
  Auth: { state: 'SignIn' | 'SignUp' };
  Ride: undefined;
  SignUpPhoneCode: undefined;
  SignInPhoneCode: undefined;
  SignInEmailCode: undefined;
  PaymentMethodSelection: undefined;
  AddressSelection: { offerPointId: number };
  Rating: undefined;
};
