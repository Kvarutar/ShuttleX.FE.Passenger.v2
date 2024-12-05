import { LatLng } from 'react-native-maps';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

type NameTypeFromAPI = 'Preferred';

type NameFromAPI = {
  id: string;
  type: NameTypeFromAPI;
  value: string;
};

type EmailTypeFromAPI = 'Contact' | 'Billing';

type EmailFromAPI = {
  id: string;
  type: EmailTypeFromAPI;
  value: string;
};

type PhoneTypeFromAPI = 'Contact';

type PhoneFromAPI = {
  id: string;
  type: PhoneTypeFromAPI;
  value: string;
};

type AvatarTypeFromAPI = 'Selected' | 'Other';

export type AvatarFromAPI = {
  value: string;
  type: AvatarTypeFromAPI;
};

export type Profile = {
  id: string;
  names: NameFromAPI[];
  emails: EmailFromAPI[];
  phones: PhoneFromAPI[];
  avatars: AvatarFromAPI[];
};

export type AvatarWithoutValueFromAPI = { id: string; type: AvatarTypeFromAPI };

export type GetProfileInfoAPIResponse = {
  id: string;
  firstNames: NameFromAPI[];
  phones: PhoneFromAPI[];
  emails: EmailFromAPI[];
  avatarIds: AvatarWithoutValueFromAPI[];
};

export type ZoneFromAPI = {
  id: string;
  name: string;
  isoName: string;
  parentZoneId: string;
  locationType: string;
  centerPoint: LatLng;
};

export type PassengerState = {
  profile: Nullable<Profile>;
  zone: Nullable<ZoneFromAPI>;
  loading: {
    passengerAvatar: boolean;
    passengerInfo: boolean;
    general: boolean;
  };
  error: {
    passengerAvatar: Nullable<NetworkErrorDetailsWithBody<any>>;
    passengerInfo: Nullable<NetworkErrorDetailsWithBody<any>>;
    general: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
};

export type GetOrUpdateZoneAPIResponse = ZoneFromAPI[];

//TODO just for test because i dont know any information for saving photo
export type FileInfo = { name: string; type: string; uri: string };

export type SaveAvatarAPIRequest = {
  file: FileInfo;
};

export type SaveAvatarAPIResponse = {
  id: string;
};

export type UpdateProfileLanguageAPIRequest = {
  type: number;
  value: string;
};
