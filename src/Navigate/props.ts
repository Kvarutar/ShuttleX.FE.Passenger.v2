import { LatLng } from 'react-native-maps';
import { CountryPhoneMaskDto } from 'shuttlex-integration';

export type RootStackParamList = {
  Splash: undefined;
  Auth: { state: 'SignIn' | 'SignUp' };
  Ride?: { openAddressSelect?: boolean };
  SignInCode: { verificationType: 'phone' | 'email'; data: string };
  AddressSelection: { orderPointId: number };
  MapAddressSelection: { orderPointId: number; pointCoordinates?: LatLng };
  Rating: undefined;
  Notifications: undefined;
  Wallet: undefined;
  AddPayment: undefined;
  Receipt: undefined;
  PhoneSelect: { initialFlag: CountryPhoneMaskDto; onFlagSelect: (flag: CountryPhoneMaskDto) => void };
  Terms: undefined;
  LockOut: undefined;
  AccountSettings: undefined;
  PromocodesScreen: undefined;
  AccountVerificateCode: { mode: 'phone' | 'email'; newValue?: string; method?: 'change' | 'verify' };
  Activity: undefined;
  Raffle: undefined;
  TicketWallet: undefined;
  ProfilePhoto: undefined;
  ActivityReceiptScreen: { orderId: string };
};
