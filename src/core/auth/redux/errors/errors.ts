import { isAxiosError } from 'axios';
import { getNetworkErrorInfo, NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { AuthNetworkErrors, IncorrectFieldsErrorBody, LockedErrorBody } from './types';

export const isLockedError = (
  errorResponse: NetworkErrorDetailsWithBody<LockedErrorBody>,
): errorResponse is NetworkErrorDetailsWithBody<LockedErrorBody> => {
  return errorResponse.status === AuthNetworkErrors.Locked;
};

export const isIncorrectFieldsError = (
  errorResponse: NetworkErrorDetailsWithBody<IncorrectFieldsErrorBody>,
): errorResponse is NetworkErrorDetailsWithBody<IncorrectFieldsErrorBody> => {
  return errorResponse.status === AuthNetworkErrors.IncorrectFields;
};

export const getAuthNetworkErrorInfo = (error: any): NetworkErrorDetailsWithBody<any> => {
  if (isAxiosError(error) && error.response) {
    const code = error.response.status;
    switch (code) {
      case 423:
        return {
          status: AuthNetworkErrors.Locked,
          code,
          body: {
            lockOutEndTime: error.response?.data.LockoutEndDate,
            lockOutReason: error.response?.data.LockOutReason,
          } as LockedErrorBody,
        };
      case 400:
        if (Array.isArray(error.response.data)) {
          return {
            status: AuthNetworkErrors.IncorrectFields,
            code,
            body: error.response?.data.map<IncorrectFieldsErrorBody>((item: { Field: string; Message: string }) => ({
              field: item.Field.toLowerCase(),
              message: item.Message,
            })),
          };
        }
        return {
          status: AuthNetworkErrors.IncorrectFields,
          code,
          body: {
            field: null,
            message: error.response?.data.Message as string,
          } as IncorrectFieldsErrorBody,
        };
    }
  }

  return getNetworkErrorInfo(error);
};
