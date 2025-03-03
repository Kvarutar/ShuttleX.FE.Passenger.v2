import { LatLng } from 'react-native-maps';
import { AccountSettingsVerificationMethod, CountryPhoneMaskDto } from 'shuttlex-integration';

export type RootStackParamList = {
  Splash: undefined;
  Auth: { state: 'SignIn' | 'SignUp' };
  Ride?: { openAddressSelect?: boolean; mapMarkerCoordinates?: LatLng };
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
  AccountVerificateCode: { mode: 'phone' | 'email'; newValue?: string; method?: AccountSettingsVerificationMethod };
  Activity: undefined;
  Raffle: undefined;
  TicketWallet: undefined;
  ProfilePhoto: undefined;
  ActivityReceiptScreen: { orderId: string };
  VideosScreen: undefined;
  AiChatScreen: undefined;
};
