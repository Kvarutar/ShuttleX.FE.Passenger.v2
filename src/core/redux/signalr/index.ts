import Config from 'react-native-config';
import { createSignalRSlice } from 'shuttlex-integration';

import { AppState } from '../store';
import { UpdatePassengerGeoSignalRRequest, UpdatePassengerGeoSignalRResponse } from './types';

const { slice, signalRThunks, createSignalRMethodThunk } = createSignalRSlice({
  options: {
    url: (() => {
      if (Config.SIGNALR_URL === undefined) {
        console.error('SIGNALR_URL is not specified in config!');
        return '';
      }
      return Config.SIGNALR_URL;
    })(),
  },
  listeners: [
    {
      methodName: 'update-passenger-geo',
      // Ignoring eslint is just for showing how you can get state
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      callback: ({ readOnlyState }: { readOnlyState: AppState }, result: UpdatePassengerGeoSignalRResponse) => {
        console.log('update-passenger-geo listener result:', result);
      },
    },
  ],
});

const updatePassengerGeo = createSignalRMethodThunk<void, UpdatePassengerGeoSignalRRequest>('update-passenger-geo');

export default slice.reducer;

const { updateSignalRAccessToken } = slice.actions;

export { signalRThunks, updatePassengerGeo, updateSignalRAccessToken };
