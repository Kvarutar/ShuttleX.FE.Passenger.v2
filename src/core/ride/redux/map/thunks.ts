import {
  getNetworkErrorInfo,
  getRandomNumberIncludesMinMax,
  MapInterestingPlace,
  MapInterestingPlaceMarkerModes,
  Nullable,
} from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../../redux/hooks';
import { geolocationCoordinatesSelector } from '../geolocation/selectors';

export const getInterestingPlaces = createAppAsyncThunk<Nullable<MapInterestingPlace[]>, void>(
  'map/getInterestingPlaces',
  async (payload, { rejectWithValue, getState }) => {
    try {
      //TODO: Remove geo and change logic when add BE logic
      const defaultLocation = geolocationCoordinatesSelector(getState());

      const getRandomOffset = () => (Math.random() - 0.5) * 0.07;
      const interestingPlaces: MapInterestingPlace[] = [
        {
          coordinate: {
            latitude: defaultLocation?.latitude ? defaultLocation.latitude + getRandomOffset() : 25.214085,
            longitude: defaultLocation?.longitude ? defaultLocation.longitude + getRandomOffset() : 55.276006,
          },
          id: 'fb0fd446-016e-40d8-861a-99c6c9ded815',
          name: 'Motiongate',
          imageFirst: {
            uri: 'https://i.postimg.cc/v8XNjzPN/image.jpg',
          },
          imageSecond: {
            uri: 'https://i.postimg.cc/Z5gkQcqS/1.jpg',
          },
          backgroundGradientColor: 'rgb(123, 99, 218)',
        },
        {
          coordinate: {
            latitude: defaultLocation?.latitude ? defaultLocation.latitude + getRandomOffset() : 25.214085,
            longitude: defaultLocation?.longitude ? defaultLocation.longitude + getRandomOffset() : 55.289006,
          },
          id: 'fb0fd446-016e-40d8-861a-99c6c9ded814',
          name: 'Marina Mall',
          imageFirst: {
            uri: 'https://i.postimg.cc/mDfvLgMp/2.jpg',
          },
          imageSecond: {
            uri: 'https://i.postimg.cc/KYMXhMKg/3.jpg',
          },
          backgroundGradientColor: 'rgb(199, 111, 219)',
        },
        {
          coordinate: {
            latitude: defaultLocation?.latitude ? defaultLocation.latitude + getRandomOffset() : 25.219085,
            longitude: defaultLocation?.longitude ? defaultLocation.longitude + getRandomOffset() : 55.276006,
          },
          id: 'fb0fd446-016e-40d8-861a-99c6c9ded813',
          name: 'Dubai Frame',
          imageFirst: {
            uri: 'https://i.postimg.cc/mkTK9pmQ/4.jpg',
          },
          imageSecond: {
            uri: 'https://i.postimg.cc/mDY0tWyL/5.jpg',
          },
          backgroundGradientColor: 'rgb(118, 138, 210)',
        },
        {
          coordinate: {
            latitude: defaultLocation?.latitude ? defaultLocation.latitude + getRandomOffset() : 25.219085,
            longitude: defaultLocation?.longitude ? defaultLocation.longitude + getRandomOffset() : 55.289006,
          },
          id: 'fb0fd446-016e-40d8-861a-99c6c9ded812',
          name: 'Mushrif National Park',
          imageFirst: {
            uri: 'https://i.postimg.cc/GtzVxPf6/6.jpg',
          },
          imageSecond: {
            uri: 'https://i.postimg.cc/wTTSTPyz/7.jpg',
          },
          backgroundGradientColor: 'rgb(111, 223, 212)',
        },
        {
          coordinate: {
            latitude: defaultLocation?.latitude ? defaultLocation.latitude + getRandomOffset() : 25.219085,
            longitude: defaultLocation?.longitude ? defaultLocation.longitude + getRandomOffset() : 55.299006,
          },
          id: 'fb0fd446-016e-40d8-861a-99c6c9ded822',
          name: 'Oceanarium',
          imageFirst: {
            uri: 'https://i.postimg.cc/59mhJ1tp/8.jpg',
          },
          imageSecond: {
            uri: 'https://i.postimg.cc/DyjRWgLX/9.jpg',
          },
          backgroundGradientColor: 'rgb(209, 111, 111)',
        },
        {
          coordinate: {
            latitude: defaultLocation?.latitude ? defaultLocation.latitude + getRandomOffset() : 25.219085,
            longitude: defaultLocation?.longitude ? defaultLocation.longitude + getRandomOffset() : 55.299006,
          },
          id: 'fb0fd446-016e-40d8-861a-99c6c9ded821',
          name: 'Flamingo Room Restaurant',
          imageFirst: {
            uri: 'https://i.postimg.cc/rmkH6YXv/10.jpg',
          },
          imageSecond: {
            uri: 'https://i.postimg.cc/Vk2Tgk7s/11.jpg',
          },
          backgroundGradientColor: 'rgb(125, 190, 74)',
        },
        {
          coordinate: {
            latitude: defaultLocation?.latitude ? defaultLocation.latitude + getRandomOffset() : 25.219085,
            longitude: defaultLocation?.longitude ? defaultLocation.longitude + getRandomOffset() : 55.299006,
          },
          id: 'fb0fd446-016e-40d8-861a-99c6c9ded823',
          name: 'Row On 45',
          imageFirst: {
            uri: 'https://i.postimg.cc/jSDmy74k/12.jpg',
          },
          imageSecond: {
            uri: 'https://i.postimg.cc/nL7WPf54/13.jpg',
          },
          backgroundGradientColor: 'rgb(218, 184, 99)',
        },
        {
          coordinate: {
            latitude: defaultLocation?.latitude ? defaultLocation.latitude + getRandomOffset() : 25.219085,
            longitude: defaultLocation?.longitude ? defaultLocation.longitude + getRandomOffset() : 55.299006,
          },
          id: 'fb0fd446-016e-40d8-861a-99c6c9ded824',
          name: 'Football Arena',
          imageFirst: {
            uri: 'https://i.postimg.cc/rmNPqCqz/14.jpg',
          },
          imageSecond: {
            uri: 'https://i.postimg.cc/RhCbh60d/15.jpg',
          },
          backgroundGradientColor: 'rgb(218, 184, 99)',
        },
        {
          coordinate: {
            latitude: defaultLocation?.latitude ? defaultLocation.latitude + getRandomOffset() : 25.219085,
            longitude: defaultLocation?.longitude ? defaultLocation.longitude + getRandomOffset() : 55.299006,
          },
          id: 'fb0fd446-016e-40d8-861a-99c6c9ded825',
          name: 'Concert Hall',
          imageFirst: {
            uri: 'https://i.postimg.cc/cCJXZpD5/17.jpg',
          },
          imageSecond: {
            uri: 'https://i.postimg.cc/C5vrqhBg/16.jpg',
          },
          backgroundGradientColor: 'rgb(218, 184, 99)',
        },
      ];

      const interestingPlacesMarkerModes = Object.values(MapInterestingPlaceMarkerModes);

      const interestingPlacesWithModes = interestingPlaces.map(interestingPlace => ({
        ...interestingPlace,
        mode: interestingPlacesMarkerModes[getRandomNumberIncludesMinMax(0, interestingPlacesMarkerModes.length - 1)],
      }));

      return interestingPlacesWithModes;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
