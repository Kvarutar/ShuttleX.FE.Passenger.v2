import { convertBlobToImgUri, getNetworkErrorInfo, Nullable } from 'shuttlex-integration';

import { getTicketAfterRide } from '../../../lottery/redux/thunks';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { createInitialOffer, getRecentDropoffs } from '../offer/thunks';
import { setOrderStatus } from '../order';
import { orderStatusSelector } from '../order/selectors';
import { OrderStatus } from '../order/types';
import { addFinishedTrips, endTrip, setTripIsCanceled, setTripStatus } from '.';
import { tripStatusSelector } from './selectors';
import {
  FeedbackAPIRequest,
  GetCurrentOrderAPIResponse,
  GetOrderInfoAPIResponse,
  Order,
  OrderLongPollingAPIResponse,
  RouteDropOffApiResponse,
  RoutePickUpApiResponse,
  TripArivedLongPollingAPIResponse,
  TripCanceledAfterPickupLongPollingAPIResponse,
  TripCanceledBeforePickupLongPollingAPIResponse,
  TripInfo,
  TripInPickupLongPollingAPIResponse,
  TripStatus,
  TripSuccessfullLongPollingAPIResponse,
} from './types';

//TODO: Rewrite this thunk if need
//Some duplicate logic because I don't know what this logic will look like in the future (we are going to receive several orders).
export const getCurrentOrder = createAppAsyncThunk<Nullable<Order>, void>(
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
  async (offerId, { rejectWithValue, passengerLongPollingAxios, dispatch, getState }) => {
    try {
      const response = await passengerLongPollingAxios.get<OrderLongPollingAPIResponse>(
        `/Offer/${offerId}/confirmed/long-polling`,
      );

      const tripStatus = tripStatusSelector(getState());

      //Check trip status because notifications can get information earlier
      if (tripStatus !== TripStatus.Accepted) {
        dispatch(getOrderInfo(response.data.orderId));
        dispatch(getRouteInfo(response.data.orderId));
        dispatch(setTripStatus(TripStatus.Accepted));
      }

      return response.data.orderId;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getTripSuccessfullLongPolling = createAppAsyncThunk<string, string>(
  'trip/getTripSuccessfullLongPolling',
  async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch, getState }) => {
    try {
      const response = await passengerLongPollingAxios.get<TripSuccessfullLongPollingAPIResponse>(
        `/Order/${orderId}/successfull/long-polling`,
      );
      const tripStatus = tripStatusSelector(getState());

      dispatch(getRecentDropoffs({ amount: 10 }));
      if (tripStatus !== TripStatus.Finished) {
        dispatch(addFinishedTrips());
        //TODO go to rating page
        dispatch(getTicketAfterRide());
        dispatch(setTripStatus(TripStatus.Finished));
      }
      return response.data.orderId;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getTripCanceledBeforePickUpLongPolling = createAppAsyncThunk<string, string>(
  'trip/getTripCanceledBeforePickUpLongPolling',
  async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch, getState }) => {
    try {
      const response = await passengerLongPollingAxios.get<TripCanceledBeforePickupLongPollingAPIResponse>(
        `/Order/${orderId}/canceled/before-pickup/long-polling`,
      );
      const orderStatus = orderStatusSelector(getState());

      if (orderStatus !== OrderStatus.Confirming) {
        dispatch(endTrip());
        dispatch(createInitialOffer());
        dispatch(setOrderStatus(OrderStatus.Confirming));
      }

      return response.data.orderId;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getTripCanceledAfterPickUpLongPolling = createAppAsyncThunk<string, string>(
  'trip/getTripCanceledAfterPickUpLongPolling',
  async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch, getState }) => {
    try {
      const response = await passengerLongPollingAxios.get<TripCanceledAfterPickupLongPollingAPIResponse>(
        `/Order/${orderId}/canceled/after-pickup/long-polling`,
      );
      const tripStatus = tripStatusSelector(getState());

      if (tripStatus !== TripStatus.Finished) {
        dispatch(setTripIsCanceled(true));
        dispatch(setTripStatus(TripStatus.Finished));
      }
      return response.data.orderId;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getArrivedLongPolling = createAppAsyncThunk<TripArivedLongPollingAPIResponse, string>(
  'trip/getArrivedLongPolling',
  async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch, getState }) => {
    try {
      const response = await passengerLongPollingAxios.get<TripArivedLongPollingAPIResponse>(
        `/Order/${orderId}/arrived/long-polling`,
      );

      const tripStatus = tripStatusSelector(getState());

      if (tripStatus !== TripStatus.Arrived) {
        dispatch(getCurrentOrder());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getInPickUpLongPolling = createAppAsyncThunk<TripInPickupLongPollingAPIResponse, string>(
  'trip/getInPickUpLongPolling',
  async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch, getState }) => {
    try {
      const response = await passengerLongPollingAxios.get<TripInPickupLongPollingAPIResponse>(
        `/Order/${orderId}/in-pick-up/long-polling`,
      );
      const tripStatus = tripStatusSelector(getState());

      if (tripStatus !== TripStatus.Ride) {
        dispatch(getCurrentOrder());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

// TODO for now we dont have logic for this
// export const getInStopPointLongPolling = createAppAsyncThunk<TripInStopPointAPIResponse, string>(
//   'trip/getInStopPointLongPolling',
//   async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch }) => {
//     try {
//       const response = await passengerLongPollingAxios.get<TripInStopPointAPIResponse>(
//         `/Order/${orderId}/in-stop-point/long-polling`,
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(getNetworkErrorInfo(error));
//     }
//   },
// );

// export const getInDropOffLongPolling = createAppAsyncThunk<TripInDropOffAPIResponse, string>(
//   'trip/getInDropOffLongPolling',
//   async (orderId, { rejectWithValue, passengerLongPollingAxios, dispatch }) => {
//     try {
//       const response = await passengerLongPollingAxios.get<TripInDropOffAPIResponse>(
//         `/Order/${orderId}/in-drop-off/long-polling`,
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(getNetworkErrorInfo(error));
//     }
//   },
// );

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
