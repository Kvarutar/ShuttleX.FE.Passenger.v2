import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { minToMilSec, NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import { cancelTrip, getCurrentOrder, getOrderInfo, getRouteInfo } from './thunks';
import {
  OrderWithTariffInfo,
  ReceiptInfo,
  RouteDropOffApiResponse,
  RoutePickUpApiResponse,
  TripState,
  TripStatus,
} from './types';
import { getFETripStatusByBETripState } from './utils';

const initialState: TripState = {
  selectedOrderId: null,
  routeInfo: null,
  status: TripStatus.Idle,
  receipt: null,
  tip: null,
  finishedTrips: 0,
  order: null,
  isCanceled: false,
  isOrderCanceled: false,
  ui: {
    isOrderCanceledAlertVisible: false,
  },
  loading: {
    routeInfo: false,
    orderInfo: false,
    currentOrder: false,
    orderLongpolling: false,
    cancelBeforePickUpLongPolling: false,
    cancelAfterPickUpLongPolling: false,
    tripSuccessfullLongPolling: false,
    cancelTrip: false,
    cancelOffer: false,
  },
  error: {
    orderInfo: null,
    currentOrder: null,
    orderLongpolling: null,
    cancelBeforePickUpLongPolling: null,
    cancelAfterPickUpLongPolling: null,
    tripSuccessfullLongPolling: null,
    cancelTrip: null,
  },
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setSelectedOrderId(state, action: PayloadAction<Nullable<string>>) {
      state.selectedOrderId = action.payload;
    },
    setTripIsCanceled(state, action: PayloadAction<boolean>) {
      state.isCanceled = action.payload;
    },
    setTripRouteInfo(
      state,
      action: PayloadAction<Nullable<{ pickUpData: RoutePickUpApiResponse; dropOffData: RouteDropOffApiResponse }>>,
    ) {
      if (action.payload) {
        state.routeInfo = {
          pickUp: action.payload.pickUpData,
          dropOff: action.payload.dropOffData,
        };
      } else {
        state.routeInfo = null;
      }
    },
    setOrderLongpollingLoading(state, action: PayloadAction<boolean>) {
      state.loading.orderLongpolling = action.payload;
    },
    setTripStatus(state, action: PayloadAction<TripStatus>) {
      state.status = action.payload;
    },
    setIsOrderCanceled(state, action: PayloadAction<boolean>) {
      state.isOrderCanceled = action.payload;
    },
    setIsOrderCanceledAlertVisible(state, action: PayloadAction<boolean>) {
      state.ui.isOrderCanceledAlertVisible = action.payload;
    },
    setTip(state, action: PayloadAction<Nullable<number>>) {
      if (state.routeInfo) {
        state.tip = action.payload;
      }
    },
    setOrder(state, action: PayloadAction<Nullable<Nullable<OrderWithTariffInfo>>>) {
      state.order = action.payload;
    },
    setTripReceipt(state, action: PayloadAction<Nullable<ReceiptInfo>>) {
      state.receipt = action.payload;
    },
    endTrip(state) {
      state.status = initialState.status;
      state.order = initialState.order;
      state.isCanceled = initialState.isCanceled;
      state.routeInfo = initialState.routeInfo;
      state.selectedOrderId = initialState.selectedOrderId;
    },
    addFinishedTrips(state) {
      state.finishedTrips++;
    },
    //TODO use it when lottery is done
    resetFinishedTrips(state) {
      state.finishedTrips = initialState.finishedTrips;
    },
  },
  extraReducers: builder => {
    builder
      //TODO: Rewrite getCurrentOrder cases if need
      //Some duplicate logic because I don't know what this logic will look like in the future (we are going to receive several orders).
      //CurrentOrder
      .addCase(getCurrentOrder.pending, state => {
        state.loading.currentOrder = true;
        state.error.currentOrder = null;
      })
      .addCase(getCurrentOrder.fulfilled, (state, action) => {
        if (action.payload && action.payload.info) {
          const { info } = action.payload;

          const { arrivedToPickUpDate } = action.payload.info;

          if (arrivedToPickUpDate) {
            const timeDifferenceInMilSec = Date.now() - Date.parse(arrivedToPickUpDate);
            info.waitingTimeInMilSec = minToMilSec(info.freeWaitingTimeMin) - timeDifferenceInMilSec;
          }

          state.order = action.payload;

          state.status = getFETripStatusByBETripState(action.payload.info?.state);
        }

        state.loading.currentOrder = false;
        state.error.currentOrder = null;
      })
      .addCase(getCurrentOrder.rejected, (state, action) => {
        state.loading.currentOrder = false;
        state.error.currentOrder = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      //OrderInfo
      .addCase(getOrderInfo.pending, state => {
        state.loading.orderInfo = true;
        state.error.orderInfo = null;
      })
      .addCase(getOrderInfo.fulfilled, (state, action) => {
        if (action.payload.info) {
          const { info } = action.payload;

          const { arrivedToPickUpDate } = action.payload.info;

          if (arrivedToPickUpDate) {
            const timeDifferenceInMilSec = Date.now() - Date.parse(arrivedToPickUpDate);
            info.waitingTimeInMilSec = minToMilSec(info.freeWaitingTimeMin) - timeDifferenceInMilSec;
          }

          state.order = action.payload;

          state.status = getFETripStatusByBETripState(action.payload.info?.state);
        }
        state.loading.tripSuccessfullLongPolling = true;
        state.loading.orderLongpolling = false;

        state.loading.orderInfo = false;
        state.error.orderInfo = null;
      })
      .addCase(getOrderInfo.rejected, (state, action) => {
        state.loading.orderInfo = false;
        state.error.orderInfo = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      //RouteInfo
      .addCase(getRouteInfo.pending, state => {
        state.loading.routeInfo = true;
      })
      .addCase(getRouteInfo.fulfilled, (state, action) => {
        slice.caseReducers.setTripRouteInfo(state, {
          payload: {
            pickUpData: action.payload.pickUpData,
            dropOffData: action.payload.dropOffData,
          },
          type: setTripRouteInfo.type,
        });
        state.loading.routeInfo = false;
      })
      .addCase(getRouteInfo.rejected, state => {
        state.loading.routeInfo = false;
      })

      //CancelTrip
      .addCase(cancelTrip.pending, state => {
        state.error.cancelTrip = null;
        state.loading.cancelTrip = true;
      })
      .addCase(cancelTrip.fulfilled, state => {
        state.isCanceled = true;
        state.status = TripStatus.Finished;
        state.error.cancelTrip = null;
        state.loading.cancelTrip = false;
        state.loading.tripSuccessfullLongPolling = false;
      })
      .addCase(cancelTrip.rejected, (state, action) => {
        state.error.cancelTrip = action.payload as NetworkErrorDetailsWithBody<any>;
        state.loading.cancelTrip = false;
      });
  },
});

export const {
  setOrder,
  setSelectedOrderId,
  setTripRouteInfo,
  setTripStatus,
  setIsOrderCanceled,
  setIsOrderCanceledAlertVisible,
  setTripReceipt,
  setTip,
  endTrip,
  addFinishedTrips,
  resetFinishedTrips,
  setTripIsCanceled,
  setOrderLongpollingLoading,
} = slice.actions;

export default slice.reducer;
