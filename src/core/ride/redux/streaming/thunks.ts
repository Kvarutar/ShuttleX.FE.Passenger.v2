import { Platform } from 'react-native';
import { getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks.ts';
import { VideosAPIResponse, VideosFromAPI } from './types.ts';

export const getVideos = createAppAsyncThunk<VideosFromAPI[], void>(
  'streaming/getVideos',
  async (_, { rejectWithValue, streamingAxios }) => {
    try {
      //TODO: change to correct userId
      const userId = '51d9fff2-7f55-41cf-8f81-c3742c9429bf';
      const manifestType = Platform.OS === 'android' ? 'DASH' : 'HLS';

      const result = await streamingAxios.get<VideosAPIResponse>(`/vod/random-manifests/${manifestType}/${userId}`);

      return result.data.vodManifests;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
