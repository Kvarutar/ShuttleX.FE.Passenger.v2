import { AxiosResponse } from 'axios';
import DeviceInfo from 'react-native-device-info';
import Keychain from 'react-native-keychain';
import { formatPhone, getNetworkErrorInfo, getTokens, saveTokens } from 'shuttlex-integration';

import { setIsLoadingStubVisible } from '../../passenger/redux';
import { createAppAsyncThunk } from '../../redux/hooks';
import { clearOffer } from '../../ride/redux/offer';
import { cleanOrder } from '../../ride/redux/order';
import { setIsLoggedIn } from '.';
import {
  SignInAPIRequest,
  SignInPayload,
  SignOutAPIRequest,
  SignUpAPIRequest,
  SignUpPayload,
  VerifyCodeAPIRequest,
  VerifyCodeAPIResponse,
  VerifyCodePayload,
} from './types';

export const signIn = createAppAsyncThunk<void, SignInPayload>(
  'auth/signIn',
  async (payload, { rejectWithValue, authAxios }) => {
    const { method, data } = payload;

    const requestData = method === 'phone' ? { phone: formatPhone(data) } : { email: data };
    const methodUrlPart = method === 'phone' ? 'sms' : 'email';

    try {
      const deviceId = await DeviceInfo.getUniqueId();

      await authAxios.post<SignInAPIRequest, void>(`/sign-in/${methodUrlPart}`, {
        ...requestData,
        deviceId,
      });
    } catch (error) {
      const { code, body, status } = getNetworkErrorInfo(error);
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
  async (payload, { rejectWithValue, dispatch, authAxios }) => {
    try {
      await authAxios.post<SignUpAPIRequest, void>('/sign-up', {
        ...payload,
        phone: formatPhone(payload.phone),
      });

      await dispatch(
        signIn({ method: payload.method, data: payload.method === 'phone' ? payload.phone : payload.email }),
      );
    } catch (error) {
      const { code, body, status } = getNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);

export const signOut = createAppAsyncThunk<void, void>(
  'auth/signOut',
  async (_, { rejectWithValue, authAxios, dispatch }) => {
    const deviceId = await DeviceInfo.getUniqueId();
    const { refreshToken } = await getTokens();

    try {
      await Keychain.resetGenericPassword();

      if (refreshToken !== null) {
        await authAxios.post<SignOutAPIRequest>('/sign-out', {
          refreshToken,
          deviceId,
          allOpenSessions: false,
        });
      }

      //clean work
      dispatch(cleanOrder());
      dispatch(clearOffer());

      dispatch(setIsLoadingStubVisible(true));
      dispatch(setIsLoggedIn(false));
    } catch (error) {
      const { code, body, status } = getNetworkErrorInfo(error);
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
  async (payload, { rejectWithValue, authAxios }) => {
    const deviceId = await DeviceInfo.getUniqueId();

    let bodyPart;

    if (payload.method === 'phone') {
      bodyPart = { phone: formatPhone(payload.body) };
    } else if (payload.method === 'email') {
      bodyPart = { email: payload.body };
    }

    const methodUrlPart = payload.method === 'phone' ? 'sms' : 'email';

    try {
      const response = await authAxios.post<VerifyCodeAPIRequest, AxiosResponse<VerifyCodeAPIResponse>>(
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
      const { code, body, status } = getNetworkErrorInfo(error);
      return rejectWithValue({
        code,
        body,
        status,
      });
    }
  },
);
