import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

type AvaliableChangeAccountContactDataMethods = 'phone' | 'email';

export type AccountSettingsState = {
  isVerificationDone: boolean;
  isLoading: boolean;
  error: NetworkErrorDetailsWithBody<any> | null;
};

export type VerifyChangeAccountContactDataCodeAPIRequest = {
  code: string;
  deviceId: string;
} & ({ phone: string } | { email: string });

export type VerifyChangeAccountContactDataCodeAPIResponse = {
  accessToken: string;
  refreshToken: string;
};

export type VerifyChangeAccountContactDataCodePayload = {
  method: AvaliableChangeAccountContactDataMethods;
  code: string;
  body: string;
};

export type ChangeAccountContactDataAPIRequest =
  | { oldPhone: string; newPhone: string }
  | { oldEmail: string; newEmail: string };

export type ChangeAccountContactDataPayload = {
  method: AvaliableChangeAccountContactDataMethods;
  data: { oldData: string; newData: string };
};
