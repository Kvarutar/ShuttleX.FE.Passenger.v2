import DeviceInfo from 'react-native-device-info';
import { formatPhone, getNetworkErrorInfo } from 'shuttlex-integration';

import { signOut } from '../../../auth/redux/thunks';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { deleteAccountRequestNetworkErrorInfo } from './errors';
import {
  AccountSettingsVerificationConfirmType,
  ChangeAccountContactDataAPIRequest,
  ChangeAccountContactDataPayload,
  SendConfirmAPIRequest,
  SendConfirmPayload,
  VerifyAccountContactDataCodeAPIRequest,
  VerifyAccountSettingsDataCodePayload,
  VerifyStatusAPIResponse,
} from './types';

export const verifyAccountSettingsDataCode = createAppAsyncThunk<void, VerifyAccountSettingsDataCodePayload>(
  'accountSettings/verifyAccountSettingsDataCode',
  async (payload, { rejectWithValue, authAccountSettingsAxios, dispatch }) => {
    const deviceId = await DeviceInfo.getUniqueId();

    let bodyPart;

    switch (payload.mode) {
      case 'phone':
        bodyPart = { phone: formatPhone(payload.body) };
        break;
      case 'email':
        bodyPart = { email: payload.body };
        break;
    }

    try {
      await authAccountSettingsAxios.post(`/otp/verify/${payload.mode}`, {
        ...bodyPart,
        code: payload.code,
        deviceId,
      } as VerifyAccountContactDataCodeAPIRequest);
      await dispatch(getAccountSettingsVerifyStatus());
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const changeAccountContactData = createAppAsyncThunk<void, ChangeAccountContactDataPayload>(
  'accountSettings/changeAccountContactData',
  async (payload, { rejectWithValue, authAccountSettingsAxios, dispatch }) => {
    const { mode, data } = payload;

    const requestData: ChangeAccountContactDataAPIRequest =
      mode === 'phone'
        ? { oldPhone: formatPhone(data.oldData), newPhone: formatPhone(data.newData) }
        : { oldEmail: data.oldData, newEmail: data.newData };

    try {
      await authAccountSettingsAxios.post(`/reset/${mode}`, requestData);
      await dispatch(requestAccountSettingsChangeDataVerificationCode({ mode, data: data.newData }));
      await dispatch(getAccountSettingsVerifyStatus());
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const requestAccountSettingsChangeDataVerificationCode = createAppAsyncThunk<void, SendConfirmPayload>(
  'accountSettings/requestAccountSettingsChangeDataVerificationCode',
  async (payload, { rejectWithValue, authAccountSettingsAxios }) => {
    const { mode, data } = payload;

    const requestData: AccountSettingsVerificationConfirmType =
      mode === 'phone' ? { phone: formatPhone(data) } : { email: data };

    try {
      const deviceId = await DeviceInfo.getUniqueId();

      authAccountSettingsAxios.post(`/otp/confirm/${mode}`, {
        ...requestData,
        deviceId,
      } as SendConfirmAPIRequest);
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getAccountSettingsVerifyStatus = createAppAsyncThunk<VerifyStatusAPIResponse, void>(
  'accountSettings/getAccountSettingsVerifyStatus',
  async (_, { rejectWithValue, authAccountSettingsAxios }) => {
    try {
      return (await authAccountSettingsAxios.get<VerifyStatusAPIResponse>('/')).data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const deleteAccountRequest = createAppAsyncThunk<void, void>(
  'accountSettings/deleteAccountRequest',
  async (_, { rejectWithValue, profileAxios, dispatch }) => {
    try {
      await profileAxios.delete('/profile');

      dispatch(signOut());
    } catch (error) {
      return rejectWithValue(deleteAccountRequestNetworkErrorInfo(error));
    }
  },
);
