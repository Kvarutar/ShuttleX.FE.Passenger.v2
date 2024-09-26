import { countryDtosProps } from 'shuttlex-integration';

export type RootStackParamList = {
  Splash: undefined;
  Auth: { state: 'SignIn' | 'SignUp' };
  Ride: undefined;
  SignInCode: { verificationType: 'phone' | 'email'; data: string };
  AddressSelection: { orderPointId: number };
  MapAddressSelection: { orderPointId: number };
  Rating: undefined;
  Notifications: undefined;
  Wallet: undefined;
  AddPayment: undefined;
  Receipt: undefined;
  PhoneSelect: { initialFlag: countryDtosProps; onFlagSelect: (flag: countryDtosProps) => void };
  Terms: undefined;
  LockOut: undefined;
};
