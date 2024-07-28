import { getAxiosErrorInfo } from 'shuttlex-integration';

import shuttlexPassengerInstance from '../../../client';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { fetchTripInfo } from '../trip/thunks';
import { orderPointsSelector, orderTariffSelector } from './selectors';
import { Address } from './types';

export const createOrder = createAppAsyncThunk<void, void>(
  'order/createOrder',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const orderPoints = orderPointsSelector(state);
    const orderTariff = orderTariffSelector(state);

    try {
      await shuttlexPassengerInstance.post('/passenger/offer/create', {
        //TODO: add passengerId: string,
        geoPickUp: orderPoints[0],
        geoStopPoints: orderPoints.slice(1),
        tariff: orderTariff,
      });

      dispatch(fetchTripInfo());
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);

export const fetchAddresses = createAppAsyncThunk<Address[], string>(
  'order/fetchAddresses',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await shuttlexPassengerInstance.get<Address[]>(`/passenger/map/addresses?addressPart=${payload}`);

      return result.data;
    } catch (error) {
      const { code, message } = getAxiosErrorInfo(error);
      return rejectWithValue({
        code,
        message,
      });
    }
  },
);
