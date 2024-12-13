import Config from 'react-native-config';
import { createSignalRSlice } from 'shuttlex-integration';

import { setMapCars } from '../../ride/redux/map';
import { MapState } from '../../ride/redux/map/types';
import { AppDispatch } from '../store';
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
      callback: ({ dispatch }: { dispatch: AppDispatch }, result: UpdatePassengerGeoSignalRResponse) => {
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

/**
 * Should be called within setInterval with same interval and only in one "state" at the time
 * (there should be no interference between "state")
 */
const updatePassengerGeo = createSignalRMethodThunk<void, UpdatePassengerGeoSignalRRequest>('update-passenger-geo');

export default slice.reducer;

const { updateSignalRAccessToken } = slice.actions;

export { signalRThunks, updatePassengerGeo, updateSignalRAccessToken };
