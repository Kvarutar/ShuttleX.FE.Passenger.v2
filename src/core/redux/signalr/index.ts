import Config from 'react-native-config';
import { createSignalRSlice } from 'shuttlex-integration';

import { setMapCars } from '../../ride/redux/map';
import { MapState } from '../../ride/redux/map/types';
import { AppDispatch, AppState } from '../store';
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
      callback: (
        // Ignoring eslint is just for showing how you can get state
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        { readOnlyState, dispatch }: { readOnlyState: AppState; dispatch: AppDispatch },
        result: UpdatePassengerGeoSignalRResponse,
      ) => {
        const formattedResult: MapState['cars'] = result.map(car => ({
          id: car.contractorId,
          coordinates: car.location,
          heading: car.angle,
        }));
        dispatch(setMapCars(formattedResult));
      },
    },
  ],
});

const updatePassengerGeo = createSignalRMethodThunk<void, UpdatePassengerGeoSignalRRequest>('update-passenger-geo');

export default slice.reducer;

const { updateSignalRAccessToken } = slice.actions;

export { signalRThunks, updatePassengerGeo, updateSignalRAccessToken };
