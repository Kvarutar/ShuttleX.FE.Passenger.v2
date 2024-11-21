import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { cancelTrip, getContractorInfo, getRouteInfo } from './thunks';
import {
  ContractorInfoApiResponse,
  RouteDropOffApiResponse,
  RoutePickUpApiResponse,
  TripState,
  TripStatus,
} from './types';

const initialState: TripState = {
  routeInfo: null,
  status: TripStatus.Idle,
  tip: null,
  finishedTrips: 0,
  contractor: null,
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
    setTripRouteInfo(
      state,
      action: PayloadAction<{ pickUpData: RoutePickUpApiResponse; dropOffData: RouteDropOffApiResponse }>,
    ) {
      if (state.routeInfo) {
        state.routeInfo.pickUp = action.payload.pickUpData;
        state.routeInfo.dropOff = action.payload.dropOffData;
      }
    },
    setContractorInfo(
      state,
      action: PayloadAction<{ info: ContractorInfoApiResponse; avatar: string; orderId: string }>,
    ) {
      if (state.contractor) {
        state.contractor.info = action.payload.info;
        state.contractor.avatar = action.payload.avatar;
        state.contractor.orderId = action.payload.orderId;
      }
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
      state.contractor = initialState.contractor;
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
      .addCase(getContractorInfo.pending, state => {
        slice.caseReducers.setTripIsLoading(state, {
          payload: true,
          type: setTripIsLoading.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(getContractorInfo.fulfilled, (state, action) => {
        slice.caseReducers.setContractorInfo(state, {
          payload: {
            info: action.payload.contractorInfo,
            avatar: action.payload.contractorAvatar,
            orderId: action.payload.orderId,
          },
          type: setContractorInfo.type,
        });
        slice.caseReducers.setTripError(state, {
          payload: initialState.error,
          type: setTripError.type,
        });
      })
      .addCase(getContractorInfo.rejected, (state, action) => {
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
      .addCase(cancelTrip.fulfilled, state => {
        slice.caseReducers.endTrip(state);
      });
  },
});

export const {
  setTripRouteInfo,
  setTripIsLoading,
  setTripError,
  setTripStatus,
  setContractorInfo,
  setTip,
  endTrip,
  addFinishedTrips,
  resetFinishedTrips,
} = slice.actions;

export default slice.reducer;
