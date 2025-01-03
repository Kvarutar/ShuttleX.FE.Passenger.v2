import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { minToMilSec, NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

import { cancelOffer } from '../offer/thunks';
import {
  cancelTrip,
  getCurrentOrder,
  getOrderInfo,
  getOrderLongPolling,
  getRouteInfo,
  getTripCanceledAfterPickUpLongPolling,
  getTripCanceledBeforePickUpLongPolling,
  getTripSuccessfullLongPolling,
} from './thunks';
import { RouteDropOffApiResponse, RoutePickUpApiResponse, TripState, TripStatus } from './types';

const initialState: TripState = {
  routeInfo: null,
  status: TripStatus.Idle,
  tip: null,
  finishedTrips: 0,
  order: null,
  isCanceled: false,
  isOrderCanceled: false,
  ui: {
    isOrderCanceledAlertVisible: false,
  },
  loading: {
    orderInfo: false,
    currentOrder: false,
    orderLongpolling: false,
    cancelBeforePickUpLongPolling: false,
    cancelAfterPickUpLongPolling: false,
    tripSuccessfullLongPolling: false,
    cancelTrip: false,
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
    setTripIsCanceled(state, action: PayloadAction<boolean>) {
      state.isCanceled = action.payload;
    },
    setTripRouteInfo(
      state,
      action: PayloadAction<{ pickUpData: RoutePickUpApiResponse; dropOffData: RouteDropOffApiResponse }>,
    ) {
      state.routeInfo = {
        pickUp: action.payload.pickUpData,
        dropOff: action.payload.dropOffData,
      };
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
    endTrip(state) {
      state.status = initialState.status;
      state.order = initialState.order;
      state.isCanceled = initialState.isCanceled;
      state.routeInfo = initialState.routeInfo;
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

          let newTripStatus: TripStatus;

          switch (action.payload.info?.state) {
            case 'MoveToPickUp':
              newTripStatus = TripStatus.Accepted;
              break;
            case 'InPickUp':
              newTripStatus = TripStatus.Arrived;
              break;
            case 'MoveToDropOff':
              newTripStatus = TripStatus.Ride;
              break;
            default:
              newTripStatus = TripStatus.Idle;
              break;
          }
          state.status = newTripStatus;
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
        state.order = action.payload;
        state.loading.tripSuccessfullLongPolling = true;
        state.loading.orderLongpolling = false;

        let newTripStatus: TripStatus;
        switch (action.payload.info?.state) {
          case 'MoveToPickUp':
            newTripStatus = TripStatus.Accepted;
            break;
          case 'InPickUp':
            newTripStatus = TripStatus.Arrived;
            break;
          case 'MoveToDropOff':
            newTripStatus = TripStatus.Ride;
            break;
          default:
            newTripStatus = TripStatus.Idle;
            break;
        }
        state.status = newTripStatus;

        state.loading.orderInfo = false;
        state.error.orderInfo = null;
      })
      .addCase(getOrderInfo.rejected, (state, action) => {
        state.loading.orderInfo = false;
        state.error.orderInfo = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      //RouteInfo
      .addCase(getRouteInfo.fulfilled, (state, action) => {
        slice.caseReducers.setTripRouteInfo(state, {
          payload: {
            pickUpData: action.payload.pickUpData,
            dropOffData: action.payload.dropOffData,
          },
          type: setTripRouteInfo.type,
        });
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
      })

      //OrderLonpolling
      .addCase(getOrderLongPolling.pending, state => {
        state.loading.orderLongpolling = true;
        state.error.orderLongpolling = null;
      })
      .addCase(getOrderLongPolling.fulfilled, state => {
        state.loading.orderLongpolling = false;
        state.error.orderLongpolling = null;
      })
      .addCase(getOrderLongPolling.rejected, (state, action) => {
        state.loading.orderLongpolling = false;
        state.error.orderLongpolling = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      //CancelOffer - stops getOrderLongPolling
      .addCase(cancelOffer.fulfilled, state => {
        state.loading.orderLongpolling = false;
      })

      //cancelBeforePickUpLongPolling
      .addCase(getTripCanceledBeforePickUpLongPolling.pending, state => {
        state.loading.cancelBeforePickUpLongPolling = true;
        state.error.cancelBeforePickUpLongPolling = null;
      })
      .addCase(getTripCanceledBeforePickUpLongPolling.fulfilled, state => {
        state.loading.cancelBeforePickUpLongPolling = false;
        state.error.cancelBeforePickUpLongPolling = null;
      })
      .addCase(getTripCanceledBeforePickUpLongPolling.rejected, (state, action) => {
        state.loading.cancelBeforePickUpLongPolling = false;
        state.error.cancelBeforePickUpLongPolling = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      //cancelAfterPickUpLongPolling
      .addCase(getTripCanceledAfterPickUpLongPolling.pending, state => {
        state.loading.cancelAfterPickUpLongPolling = true;
        state.error.cancelAfterPickUpLongPolling = null;
      })
      .addCase(getTripCanceledAfterPickUpLongPolling.fulfilled, state => {
        state.loading.cancelAfterPickUpLongPolling = false;
        state.error.cancelAfterPickUpLongPolling = null;
      })
      .addCase(getTripCanceledAfterPickUpLongPolling.rejected, (state, action) => {
        state.loading.cancelAfterPickUpLongPolling = false;
        state.error.cancelAfterPickUpLongPolling = action.payload as NetworkErrorDetailsWithBody<any>;
      })

      //TripSuccessfullLongPolling
      .addCase(getTripSuccessfullLongPolling.pending, state => {
        state.loading.tripSuccessfullLongPolling = true;
        state.error.tripSuccessfullLongPolling = null;
      })
      .addCase(getTripSuccessfullLongPolling.fulfilled, state => {
        state.loading.tripSuccessfullLongPolling = false;
        state.error.tripSuccessfullLongPolling = null;
      })
      .addCase(getTripSuccessfullLongPolling.rejected, (state, action) => {
        state.loading.tripSuccessfullLongPolling = false;
        state.error.tripSuccessfullLongPolling = action.payload as NetworkErrorDetailsWithBody<any>;
      });
  },
});

export const {
  setTripRouteInfo,
  setTripStatus,
  setIsOrderCanceled,
  setIsOrderCanceledAlertVisible,
  setTip,
  endTrip,
  addFinishedTrips,
  resetFinishedTrips,
  setTripIsCanceled,
  setOrderLongpollingLoading,
} = slice.actions;

export default slice.reducer;
