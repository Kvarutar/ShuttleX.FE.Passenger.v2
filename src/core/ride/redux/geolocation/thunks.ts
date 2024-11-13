import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { geolocationSliceName } from '.';
import { ConvertGeoToAddressAPIResponse, ConvertGeoToAddressPayload } from './types';

export const convertGeoToAddress = createAppAsyncThunk<string, ConvertGeoToAddressPayload>(
  `${geolocationSliceName}/convertGeoToAddress`,
  async (payload, { rejectWithValue, geomappingAxios }) => {
    try {
      const result = await geomappingAxios.get<ConvertGeoToAddressAPIResponse>(
        `/web-mapping/search/geo?Latitude=${payload.latitude}&Longitude=${payload.longitude}`,
      );

      return result.data[0].fullAddress;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
