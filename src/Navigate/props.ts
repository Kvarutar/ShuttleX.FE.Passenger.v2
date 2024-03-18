export type RootStackParamList = {
  Splash: undefined;
  Auth: { state: 'SignIn' | 'SignUp' };
  Ride: undefined;
  SignUpPhoneCode: undefined;
  SignInPhoneCode: undefined;
  SignInEmailCode: undefined;
  AddressSelection: { offerPointId: number };
  Rating: undefined;
  Notifications: undefined;
  Wallet: undefined;
  AddPayment: undefined;
};
