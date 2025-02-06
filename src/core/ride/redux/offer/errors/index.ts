import { isAxiosError } from 'axios';
import { getNetworkErrorInfo, NetworkErrorDetailsWithBody, NetworkErrorsStatuses } from 'shuttlex-integration';

//TODO: Add code field to all error in Integration
export const isRoutePointsLocationError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.ServerError && errorResponse.body?.code === 10006;
};

export const isRouteLengthTooShortError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.ServerError && errorResponse.body?.code === 10008;
};

export const isTooManyActiveRidesError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.ServerError && errorResponse.body?.code === 10010;
};

export const getOfferNetworkErrorInfo = (error: any): NetworkErrorDetailsWithBody<any> => {
  if (isAxiosError(error) && error.response) {
    const code = error.response.status;
    switch (code) {
      case 500:
        return {
          status: NetworkErrorsStatuses.ServerError,
          code,
          body: {
            code: error.response?.data.Code,
            message: error.response?.data.Message,
          },
        };
    }
  }

  return getNetworkErrorInfo(error);
};
