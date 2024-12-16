import { convertBlobToImgUri, getNetworkErrorInfo, Nullable } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { createInitialOffer } from '../offer/thunks';
import { setOrderStatus } from '../order';
import { OrderStatus } from '../order/types';
import { endTrip, setTripIsCanceled, setTripStatus } from '.';
import {
  FeedbackAPIRequest,
  GetCurrentOrderAPIResponse,
  GetOrderInfoAPIResponse,
  Order,
  OrderLongPollingAPIResponse,
  RouteDropOffApiResponse,
  RoutePickUpApiResponse,
  TripCanceledAfterPickupLongPollingAPIResponse,
  TripCanceledBeforePickupLongPollingAPIResponse,
  TripInfo,
  TripStatus,
  TripSuccessfullLongPollingAPIResponse,
} from './types';

//TODO: Rewrite this thunk if need
//Some duplicate logic because I don't know what this logic will look like in the future (we are going to receive several orders).
export const getCurrentOrder = createAppAsyncThunk<Nullable<Order>, void>(
  'trip/getCurrentOrder',
  async (_, { rejectWithValue, orderAxios }) => {
    try {
      const response = await orderAxios.get<GetCurrentOrderAPIResponse>('/current');

      let avatar = null;

      if (response.data) {
        try {
          avatar = await orderAxios.get<Blob>(
            `/${response.data.orderId}/contractors/avatars/${response.data.avatarIds[0]}`,
            {
              responseType: 'blob',
            },
          );
        } catch {}

        return {
          info: response.data,
          avatar: avatar ? await convertBlobToImgUri(avatar.data) : null,
          orderId: response.data.orderId,
        };
      }

      return null;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

//TODO decide what to do with this thunk
export const fetchTripInfo = createAppAsyncThunk<TripInfo, void>(
  'trip/fetchTripInfo',
  async (_, { rejectWithValue, passengerAxios }) => {
    try {
      //TODO: replace passengerID with actual one
      const response = await passengerAxios.get<TripInfo>('/passenger/order/get?passengerId=1');

      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getOrderInfo = createAppAsyncThunk<Order, string>(
  'trip/getOrderInfo',
  async (orderId, { rejectWithValue, orderAxios }) => {
    try {
      const data = (await orderAxios.get<GetOrderInfoAPIResponse>(`/${orderId}`)).data;
      let avatar = null;

      try {
        avatar = await orderAxios.get<Blob>(`/${orderId}/contractors/avatars/${data.avatarIds[0]}`, {
          responseType: 'blob',
        });
      } catch {}

      return {
        info: data,
        avatar: avatar ? await convertBlobToImgUri(avatar.data) : null,
        orderId,
      };
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getRouteInfo = createAppAsyncThunk<
  { pickUpData: RoutePickUpApiResponse; dropOffData: RouteDropOffApiResponse },
  string
>('trip/getRouteInfo', async (orderId, { rejectWithValue, orderAxios }) => {
  try {
    const [pickUpResponse, dropOffResponse] = await Promise.all([
      orderAxios.get<RoutePickUpApiResponse>(`/${orderId}/route/pickup`),
      orderAxios.get<RouteDropOffApiResponse>(`/${orderId}/route/dropoff`),
    ]);
    return {
      pickUpData: pickUpResponse.data,
      dropOffData: dropOffResponse.data,
    };
  } catch (error) {
    return rejectWithValue(getNetworkErrorInfo(error));
  }
});

export const getOrderLongPolling = createAppAsyncThunk<string, string>(
  'trip/getOrderLongPolling',
  async (offerId, { rejectWithValue, passengerLongPollingAxios, dispatch }) => {
    try {
      const response = await passengerLongPollingAxios.get<OrderLongPollingAPIResponse>(
        `/Offer/${offerId}/confirmed/long-polling`,
      );
      dispatch(getOrderInfo(response.data.orderId));
      dispatch(getRouteInfo(response.data.orderId));
      //TODO check this case
      dispatch(setTripStatus(TripStatus.Accepted));
      return response.data.orderId;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

// export const getContractorInfo = createAppAsyncThunk<ContractorApiResponse, string>(
//   'trip/getContractorInfo',
//   async (orderId, { rejectWithValue, orderAxios }) => {
//     try {
//       const info = (await orderAxios.get<ContractorInfo>(`/${orderId}`)).data;
//       const avatar = await orderAxios.get<Blob>(`/${orderId}/contractors/avatars/${info.avatarIds[0]}`, { responseType: 'blob' })

//       return {
//         info,
//         avatar: await convertBlobToImgUri(avatar.data),
//         orderId,
//       };
//     } catch (error) {
//       return rejectWithValue(getNetworkErrorInfo(error));
//     }
//   },
// );

export const getTripSuccessfullLongPolling = createAppAsyncThunk<string, string>(
  'trip/getTripSuccessfullLongPolling',
  async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch }) => {
    try {
      const response = await passengerLongPollingAxios.get<TripSuccessfullLongPollingAPIResponse>(
        `/Order/${orderId}/successfull/long-polling`,
      );
      dispatch(setTripStatus(TripStatus.Finished));
      return response.data.orderId;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getTripCanceledBeforePickUpLongPolling = createAppAsyncThunk<string, string>(
  'trip/getTripCanceledBeforePickUpLongPolling',
  async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch }) => {
    try {
      const response = await passengerLongPollingAxios.get<TripCanceledBeforePickupLongPollingAPIResponse>(
        `/Order/${orderId}/canceled/before-pickup/long-polling`,
      );
      dispatch(endTrip());
      dispatch(createInitialOffer());
      dispatch(setOrderStatus(OrderStatus.Confirming));

      return response.data.orderId;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getTripCanceledAfterPickUpLongPolling = createAppAsyncThunk<string, string>(
  'trip/getTripCanceledAfterPickUpLongPolling',
  async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch }) => {
    try {
      const response = await passengerLongPollingAxios.get<TripCanceledAfterPickupLongPollingAPIResponse>(
        `/Order/${orderId}/canceled/after-pickup/long-polling`,
      );
      dispatch(setTripIsCanceled(true));
      dispatch(setTripStatus(TripStatus.Finished));
      return response.data.orderId;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const sendFeedback = createAppAsyncThunk<FeedbackAPIRequest, { orderId: string; payload: FeedbackAPIRequest }>(
  'trip/sendFeedback',
  async ({ orderId, payload }, { rejectWithValue, orderAxios }) => {
    try {
      await orderAxios.post(`/rate/${orderId}`, {
        isLikedByPassenger: payload.isLikedByPassenger,
        positiveFeedbacks: payload.positiveFeedbacks,
        negativeFeedbacks: payload.negativeFeedbacks,
      } as FeedbackAPIRequest);
      return payload;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const cancelTrip = createAppAsyncThunk<void, string>(
  'trip/cancelTrip',
  async (orderId, { rejectWithValue, orderAxios }) => {
    try {
      await orderAxios.put(`/cancel/${orderId}`);
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
export const sendMysteryBoxPopupResponse = createAppAsyncThunk<void, { passengerId: string; res: boolean }>(
  'trip/sendMysteryBoxPopupResponse',
  async () => {
    //TODO: Add networking
    // try {
    //   // const response = await shuttlexPassengerInstance.post<TripInfo>(`/passenger/trip/mystery-box/${passengerId}`);
    // } catch (error) {
    //   const { code, message } = getAxiosErrorInfo(error);
    //   return rejectWithValue({
    //     code,
    //     message,
    //   });
    // }
  },
);
