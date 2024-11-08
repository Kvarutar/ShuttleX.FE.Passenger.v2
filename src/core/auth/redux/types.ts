import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

type AvaliableSignMethods = 'phone' | 'email';

export type SignInAPIRequest = {
  deviceId: string;
  resendAtempt?: number;
} & ({ phone: string } | { email: string });

export type SignUpAPIRequest = {
  phone: string;
  firstName: string;
  email: string;
  method: AvaliableSignMethods;
};

export type SignOutAPIRequest = {
  refreshToken: string;
  deviceId: string;
  allOpenSessions: boolean;
};

export type SignUpPayload = {
  firstName: string;
  phone: string;
  email: string;
  method: AvaliableSignMethods;
};

export type SignOutPayload = {
  refreshToken: string | null;
};

export type SignInPayload = {
  method: AvaliableSignMethods;
  data: string;
};

export type VerifySmsCodePayload = {
  phone: string;
  code: string;
};

export type VerifyEmailCodePayload = {
  email: string;
  code: string;
};

export type VerifyCodePayload = {
  method: AvaliableSignMethods;
  code: string;
  body: string;
};

export type VerifyCodeAPIRequest = {
  code: string;
  deviceId: string;
} & ({ phone: string } | { email: string });

export type VerifyCodeAPIResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  isLoading: boolean;
  error: NetworkErrorDetailsWithBody<any> | null;
  isLoggedIn: boolean;
};
