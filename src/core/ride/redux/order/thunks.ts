import Config from 'react-native-config';

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
      const response = await fetch(`${Config.API_URL_HTTPS}/Offer/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //TODO: add passengerId: string,
          geoPickUp: orderPoints[0],
          geoStopPoints: orderPoints.slice(1),
          tariff: orderTariff,
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      dispatch(fetchTripInfo());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchAddresses = createAppAsyncThunk<Address[], string>(
  'order/fetchAddresses',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await fetch(`${Config.API_URL_HTTPS}/map/addresses?addressPart=${payload}`);

      return (await result.json()) as Address[];
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
