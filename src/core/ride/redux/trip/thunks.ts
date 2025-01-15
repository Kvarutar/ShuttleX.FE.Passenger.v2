import { convertBlobToImgUri, getNetworkErrorInfo, Nullable } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { TariffFromAPI } from '../offer/types';
import {
  FeedbackAPIRequest,
  GetCurrentOrderAPIResponse,
  GetOrderInfoAPIResponse,
  GetTariffInfoByIdAPIResponse,
  OrderWithTariffInfo,
  RouteDropOffApiResponse,
  RoutePickUpApiResponse,
  TripInfo,
} from './types';

export const getTariffInfoById = createAppAsyncThunk<TariffFromAPI, { tariffId: string }>(
  'trip/getTariffInfoById',
  async (payload, { rejectWithValue, configAxios }) => {
    try {
      return (await configAxios.get<GetTariffInfoByIdAPIResponse>(`/tariffs/${payload.tariffId}`)).data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

//TODO: Rewrite this thunk if need
//Some duplicate logic because I don't know what this logic will look like in the future (we are going to receive several orders).
export const getCurrentOrder = createAppAsyncThunk<Nullable<OrderWithTariffInfo>, void>(
  'trip/getCurrentOrder',
  async (_, { rejectWithValue, orderAxios, dispatch }) => {
    try {
      const response = await orderAxios.get<GetCurrentOrderAPIResponse>('/current');

      let avatar = null;

      if (response.data) {
        try {
          dispatch(getRouteInfo(response.data.orderId));
          avatar = await orderAxios.get<Blob>(
            `/${response.data.orderId}/contractors/avatars/${response.data.avatarIds[0]}`,
            {
              responseType: 'blob',
            },
          );
        } catch {}

        const tariffInfo = await dispatch(getTariffInfoById({ tariffId: response.data.tariffId })).unwrap();

        return {
          info: response.data,
          avatar: avatar ? await convertBlobToImgUri(avatar.data) : null,
          orderId: response.data.orderId,
          tariffInfo,
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

export const getOrderInfo = createAppAsyncThunk<OrderWithTariffInfo, string>(
  'trip/getOrderInfo',
  async (orderId, { rejectWithValue, orderAxios, dispatch }) => {
    try {
      const data = (await orderAxios.get<GetOrderInfoAPIResponse>(`/${orderId}`)).data;
      let avatar = null;

      try {
        avatar = await orderAxios.get<Blob>(`/${orderId}/contractors/avatars/${data.avatarIds[0]}`, {
          responseType: 'blob',
        });
      } catch {}

      const tariffInfo = await dispatch(getTariffInfoById({ tariffId: data.tariffId })).unwrap();

      return {
        info: data,
        avatar: avatar ? await convertBlobToImgUri(avatar.data) : null,
        orderId,
        tariffInfo,
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
