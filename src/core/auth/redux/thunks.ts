import { AxiosResponse } from 'axios';
import { saveTokens } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../redux/hooks';
import { getAuthNetworkErrorInfo } from './errors/errors';
import {
  SignInAPIRequest,
  SignInPayload,
  SignOutAPIRequest,
  SignOutPayload,
  SignUpAPIRequest,
  SignUpPayload,
  VerifyCodeAPIRequest,
  VerifyCodeAPIResponse,
  VerifyCodePayload,
} from './types';

const formatePhone = (phone: string) => {
  return phone.replace(/[^+\d]/g, '');
};

export const signIn = createAppAsyncThunk<void, SignInPayload>(
  'auth/signIn',
  async (payload, { rejectWithValue, shuttlexAuthAxios }) => {
    const { method, data } = payload;

    const requestData = method === 'phone' ? { phone: formatePhone(data) } : { email: data };
    const methodUrlPart = method === 'phone' ? 'sms' : 'email';

    try {
      //TODO: do firebase init
      //const deviceId = await getNotificationToken();
      const deviceId = 'string';

      await shuttlexAuthAxios.post<SignInAPIRequest, void>(`/sign-in/${methodUrlPart}`, {
        ...requestData,
        deviceId,
      });
    } catch (error) {
      const { code, body, status } = getAuthNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);

export const signUp = createAppAsyncThunk<void, SignUpPayload>(
  'auth/signUp',
  async (payload, { rejectWithValue, dispatch, shuttlexAuthAxios }) => {
    try {
      await shuttlexAuthAxios.post<SignUpAPIRequest, void>('/sign-up', {
        ...payload,
        phone: formatePhone(payload.phone),
      });

      await dispatch(
        signIn({ method: payload.method, data: payload.method === 'phone' ? payload.phone : payload.email }),
      );
    } catch (error) {
      const { code, body, status } = getAuthNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);

export const signOut = createAppAsyncThunk<void, SignOutPayload>(
  'auth/signOut',
  async (payload, { rejectWithValue, shuttlexAuthAxios }) => {
    //TODO: do firebase init
    //const deviceId = await getNotificationToken();
    const deviceId = 'string';

    try {
      if (payload.refreshToken !== null) {
        await shuttlexAuthAxios.post<SignOutAPIRequest>('/sign-out', {
          ...payload,
          deviceId,
          allOpenSessions: false,
        });
      }
    } catch (error) {
      const { code, body, status } = getAuthNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);

export const verifyCode = createAppAsyncThunk<void, VerifyCodePayload>(
  'auth/verifyCode',
  async (payload, { rejectWithValue, shuttlexAuthAxios }) => {
    //TODO: do firebase init
    //const deviceId = await getNotificationToken();
    const deviceId = 'string';

    let bodyPart;

    if (payload.method === 'phone') {
      bodyPart = { phone: formatePhone(payload.body) };
    } else if (payload.method === 'email') {
      bodyPart = { email: payload.body };
    }

    const methodUrlPart = payload.method === 'phone' ? 'sms' : 'email';

    try {
      const response = await shuttlexAuthAxios.post<VerifyCodeAPIRequest, AxiosResponse<VerifyCodeAPIResponse>>(
        `/verify-code/${methodUrlPart}`,
        {
          ...bodyPart,
          code: payload.code,
          deviceId,
        },
      );

      await saveTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    } catch (error) {
      const { code, body, status } = getAuthNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);
