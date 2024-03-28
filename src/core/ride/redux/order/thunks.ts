import Config from 'react-native-config';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { fetchTripInfo } from '../trip/thunks';
import { OrderPointsSelector, OrderTariffSelector } from './selectors';

export const createOffer = createAppAsyncThunk<void, void>(
  'order/createOffer',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const offerPoints = OrderPointsSelector(state);
    const offerTariff = OrderTariffSelector(state);

    try {
      const response = await fetch(`${Config.API_URL_HTTPS}/Offer/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //TODO: add passengerId
          geoPickUp: offerPoints[0],
          geoStopPoints: offerPoints.slice(1),
          tariff: offerTariff,
        }),
      });

      if (!response.ok) {
        return rejectWithValue(await response.json());
      }

      dispatch(fetchTripInfo());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
