import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { cancelTrip, getCurrentOrder, getOrderInfo, getRouteInfo } from './thunks';
import { Order, RouteDropOffApiResponse, RoutePickUpApiResponse, TripState, TripStatus } from './types';

const initialState: TripState = {
  routeInfo: null,
  status: TripStatus.Idle,
  tip: null,
  finishedTrips: 0,
  order: null,
  isCanceled: false,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTripIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setTripError(state, action: PayloadAction<TripState['error']>) {
      state.error = action.payload;
    },
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
    setOrderInfo(state, action: PayloadAction<Order>) {
      state.order = action.payload;
    },
    setTripStatus(state, action: PayloadAction<TripStatus>) {
      state.status = action.payload;
    },
    setTip(state, action: PayloadAction<number | null>) {
      if (state.routeInfo) {
        state.tip = action.payload;
      }
    },
    endTrip(state) {
      state.routeInfo = null;
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
      .addCase(getCurrentOrder.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(getCurrentOrder.fulfilled, (state, action) => {
        if (action.payload) {
          slice.caseReducers.setOrderInfo(state, {
            payload: action.payload,
            type: setOrderInfo.type,
          });

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

          slice.caseReducers.setTripStatus(state, {
            payload: newTripStatus,
            type: setTripStatus.type,
          });
        }

        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(getCurrentOrder.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      })
      .addCase(getOrderInfo.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(getOrderInfo.fulfilled, (state, action) => {
        slice.caseReducers.setOrderInfo(state, {
          payload: action.payload,
          type: setOrderInfo.type,
        });

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

        slice.caseReducers.setTripStatus(state, {
          payload: newTripStatus,
          type: setTripError.type,
        });

        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(getOrderInfo.rejected, (state, action) => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: false,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      })
      .addCase(getRouteInfo.fulfilled, (state, action) => {
        slice.caseReducers.setTripRouteInfo(state, {
          payload: { pickUpData: action.payload.pickUpData, dropOffData: action.payload.dropOffData },
          type: setTripRouteInfo.type,
        });
      })
      .addCase(cancelTrip.pending, state => {
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(cancelTrip.fulfilled, state => {
        slice.caseReducers.setTripIsCanceled(state, {
          payload: true,
          type: setTripIsCanceled.type,
        });
        slice.caseReducers.setTripStatus(state, {
          payload: TripStatus.Finished,
          type: setTripStatus.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(cancelTrip.rejected, (state, action) => {
        slice.caseReducers.setTripError(state, {
          payload: action.payload as NetworkErrorDetailsWithBody<any>, //TODO: remove this cast after fix with rejectedValue
          type: setTripError.type,
        });
      });
  },
});

export const {
  setTripRouteInfo,
  setTripIsLoading,
  setTripError,
  setTripStatus,
  setOrderInfo,
  setTip,
  endTrip,
  addFinishedTrips,
  resetFinishedTrips,
  setTripIsCanceled,
} = slice.actions;

export default slice.reducer;
