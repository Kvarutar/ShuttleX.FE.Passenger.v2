import { formatPhone, getNetworkErrorInfo, saveTokens } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import {
  ChangeAccountContactDataAPIRequest,
  ChangeAccountContactDataPayload,
  VerifyChangeAccountContactDataCodeAPIRequest,
  VerifyChangeAccountContactDataCodeAPIResponse,
  VerifyChangeAccountContactDataCodePayload,
} from './types';

export const verifyChangeAccountDataCode = createAppAsyncThunk<void, VerifyChangeAccountContactDataCodePayload>(
  'accountSettings/verifyChangeAccountDataCode',
  async (payload, { rejectWithValue, authAxios }) => {
    //TODO get deviceId from back
    const deviceId = 'string';

    let bodyPart;
    let methodUrlPart;

    switch (payload.method) {
      case 'phone':
        bodyPart = { phone: formatPhone(payload.body) };
        methodUrlPart = 'sms';
        break;
      case 'email':
        bodyPart = { email: payload.body };
        methodUrlPart = 'email';
        break;
    }

    try {
      const response = await authAxios.post<VerifyChangeAccountContactDataCodeAPIResponse>(
        `/verify-code/${methodUrlPart}`,
        {
          ...bodyPart,
          code: payload.code,
          deviceId,
        } as VerifyChangeAccountContactDataCodeAPIRequest,
      );

      await saveTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const changeAccountContactData = createAppAsyncThunk<void, ChangeAccountContactDataPayload>(
  'accountSettings/changeAccountContactData',
  async (payload, { rejectWithValue, authResetAxios }) => {
    const { method, data } = payload;

    const requestData: ChangeAccountContactDataAPIRequest =
      method === 'phone'
        ? { oldPhone: formatPhone(data.oldData), newPhone: formatPhone(data.newData) }
        : { oldEmail: data.oldData, newEmail: data.newData };

    try {
      await authResetAxios.post(`/reset/${method}`, requestData);
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
