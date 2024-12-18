import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

type AvaliableChangeAccountContactDataMethods = 'phone' | 'email';

export type AccountSettingsState = {
  loading: {
    changeData: boolean;
    verify: boolean;
    requestCode: boolean;
    getVerifyStatus: boolean;
  };
  error: {
    changeData: Nullable<NetworkErrorDetailsWithBody<any>>;
    verify: Nullable<NetworkErrorDetailsWithBody<any>>;
    requestCode: Nullable<NetworkErrorDetailsWithBody<any>>;
    getVerifyStatus: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
  verifyStatus: VerifyStatusAPIResponse;
};

export type VerifyAccountContactDataCodeAPIRequest = {
  code: string;
  deviceId: string;
} & ({ phone: string } | { email: string });

export type VerifyAccountContactDataCodeAPIResponse = {
  success: boolean;
};

export type VerifyAccountSettingsDataCodePayload = {
  mode: AvaliableChangeAccountContactDataMethods;
  code: string;
  body: string;
};

export type VerifyEmailAccountSettingsCodePayload = {
  code: string;
  body: string;
};

export type VerifyEmailAccountSettingsCodeAPIRequest = {
  code: string;
  deviceId: string;
  email: string;
};

export type ChangeAccountContactDataAPIRequest =
  | { oldPhone: string; newPhone: string }
  | { oldEmail: string; newEmail: string };

export type ChangeAccountContactDataPayload = {
  mode: AvaliableChangeAccountContactDataMethods;
  data: { oldData: string; newData: string };
};

export type SendConfirmPayload = {
  mode: AvaliableChangeAccountContactDataMethods;
  data: string;
};

export type SendConfirmAPIRequest = {
  deviceId: string;
  resendAtempt?: number;
} & ({ phone: string } | { email: string });

export type AccountSettingsVerificationConfirmType =
  | {
      phone: string;
    }
  | {
      email: string;
    };

export type VerifyStatusAPIResponse = {
  phoneInfo: string;
  isPhoneVerified: boolean;
  emailInfo: string;
  isEmailVerified: boolean;
};
