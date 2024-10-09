import { CountryPhoneMaskDto } from 'shuttlex-integration';

export type RootStackParamList = {
  Splash: undefined;
  Auth: { state: 'SignIn' | 'SignUp' };
  Ride?: { openAddressSelect?: boolean };
  SignInCode: { verificationType: 'phone' | 'email'; data: string };
  AddressSelection: { orderPointId: number };
  MapAddressSelection: { orderPointId: number };
  Rating: undefined;
  Notifications: undefined;
  Wallet: undefined;
  AddPayment: undefined;
  Receipt: undefined;
  PhoneSelect: { initialFlag: CountryPhoneMaskDto; onFlagSelect: (flag: CountryPhoneMaskDto) => void };
  Terms: undefined;
  LockOut: undefined;
  AccountSettings: undefined;
  Activity: undefined;
};
