import { isAxiosError } from 'axios';
import { getNetworkErrorInfo, NetworkErrorDetailsWithBody, NetworkErrorsStatuses } from 'shuttlex-integration';

//TODO: Add code field to all error in Integration
export const isRoutePointsLocationError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.BadRequest && errorResponse.body?.code === 10006;
};

export const isRouteLengthTooShortError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.BadRequest && errorResponse.body?.code === 10011;
};

export const isTooManyActiveRidesError = (
  errorResponse: NetworkErrorDetailsWithBody,
): errorResponse is NetworkErrorDetailsWithBody => {
  return errorResponse.status === NetworkErrorsStatuses.BadRequest && errorResponse.body?.code === 10010;
};

export const getOfferNetworkErrorInfo = (error: any): NetworkErrorDetailsWithBody<any> => {
  if (isAxiosError(error) && error.response) {
    const code = error.response.status;
    switch (code) {
      case 400:
        return {
          status: NetworkErrorsStatuses.BadRequest,
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
