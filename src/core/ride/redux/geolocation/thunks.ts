import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { geolocationSliceName } from '.';
import { ConvertGeoToAddressAPIResponse, ConvertGeoToAddressPayload } from './types';

export const convertGeoToAddress = createAppAsyncThunk<ConvertGeoToAddressAPIResponse[0], ConvertGeoToAddressPayload>(
  `${geolocationSliceName}/convertGeoToAddress`,
  async (payload, { rejectWithValue, passengerAxios }) => {
    try {
      const result = await passengerAxios.get<ConvertGeoToAddressAPIResponse>(
        `/Ride/places/geo?latitude=${payload.latitude}&longitude=${payload.longitude}`,
      );

      return result.data[0];
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
