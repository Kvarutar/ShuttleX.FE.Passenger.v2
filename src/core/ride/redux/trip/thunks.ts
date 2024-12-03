import { convertBlobToImgUri, getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import {
  FeedbackAPIRequest,
  GetOrderInfoAPIResponse,
  GetOrdersHistoryAPIResponse,
  Order,
  OrderFromAPI,
  RouteDropOffApiResponse,
  RoutePickUpApiResponse,
  TripInfo,
} from './types';

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

//change to normal order
export const getOrderInfo = createAppAsyncThunk<Order, string>(
  'trip/getOrderInfo',
  async (orderId, { rejectWithValue, orderAxios }) => {
    try {
      const data = (await orderAxios.get<GetOrderInfoAPIResponse>(`/${orderId}`)).data;
      const avatar = await orderAxios.get<Blob>(`/${orderId}/contractors/avatars/${data.avatarIds[0]}`, {
        responseType: 'blob',
      });

      return {
        info: data,
        avatar: await convertBlobToImgUri(avatar.data),
        orderId,
      };
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

export const getOrdersHistory = createAppAsyncThunk<OrderFromAPI[], string>(
  'trip/getOrdersHistory',
  async (_, { rejectWithValue, passengerAxios }) => {
    try {
      const data = (await passengerAxios.get<GetOrdersHistoryAPIResponse>('/Ride/orders')).data;

      return data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getActiveOrdersHistory = createAppAsyncThunk<OrderFromAPI[], string>(
  'trip/getActiveOrdersHistory',
  async (_, { rejectWithValue, passengerAxios }) => {
    try {
      const data = (await passengerAxios.get<GetOrdersHistoryAPIResponse>('/Ride/orders')).data;

      return data;
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
