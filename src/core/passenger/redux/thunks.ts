import { convertBlobToImgUri, getNetworkErrorInfo } from 'shuttlex-integration';

import { createAppAsyncThunk } from '../../redux/hooks';
import { geolocationCoordinatesSelector } from '../../ride/redux/geolocation/selectors';
import { OrderFromAPI } from '../../ride/redux/trip/types';
import {
  AvatarFromAPI,
  AvatarWithoutValueFromAPI,
  GetOrdersHistoryAPIResponse,
  GetOrUpdateZoneAPIResponse,
  GetProfileInfoAPIResponse,
  Profile,
  SaveAvatarAPIRequest,
  SaveAvatarAPIResponse,
  UpdateProfileLanguageAPIRequest,
  ZoneFromAPI,
} from './types';

export const getOrdersHistory = createAppAsyncThunk<OrderFromAPI[], void>(
  'passenger/getOrdersHistory',
  async (_, { rejectWithValue, passengerAxios }) => {
    try {
      return (await passengerAxios.get<GetOrdersHistoryAPIResponse>('/Ride/orders')).data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getProfileInfo = createAppAsyncThunk<Profile, void>(
  'passenger/getProfileInfo',
  async (_, { rejectWithValue, profileAxios, dispatch }) => {
    try {
      const response = await profileAxios.get<GetProfileInfoAPIResponse>('/profile');

      const { id, firstNames, phones, emails, avatarIds } = response.data;

      //TODO: rewrite this logic for many avatars
      const mainAvatar = avatarIds.find(el => el.type === 'Selected') ?? avatarIds[0];

      const avatars = await dispatch(getAvatar(mainAvatar)).unwrap();

      return {
        id,
        names: firstNames,
        emails,
        phones,
        avatars,
      };
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getAvatar = createAppAsyncThunk<AvatarFromAPI[], AvatarWithoutValueFromAPI | AvatarWithoutValueFromAPI[]>(
  'passenger/getAvatar',
  async (payload, { rejectWithValue, profileAxios }) => {
    if (!payload) {
      return [];
    }
    if (Array.isArray(payload)) {
      //TODO: rewrite this logic with allSettled for array of avatars id's
      return [];
    }

    try {
      const res = await profileAxios.get<Blob>(`profile/avatars/${payload.id}/blob`, { responseType: 'blob' });

      const value = await convertBlobToImgUri(res.data);

      return [
        {
          value,
          type: payload.type,
        },
      ];
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

//TODO just for test because i dont know any information for saving photo
export const saveAvatar = createAppAsyncThunk<SaveAvatarAPIResponse, SaveAvatarAPIRequest>(
  'passenger/saveAvatar',
  async (data, { rejectWithValue, profileAxios, dispatch }) => {
    const { file } = data;
    const formData = new FormData();
    formData.append('Avatar', file);

    try {
      const response = await profileAxios.post<SaveAvatarAPIResponse>('profile/avatars/blob', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(getProfileInfo());

      return response.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getOrUpdateZone = createAppAsyncThunk<ZoneFromAPI | null, void>(
  'passenger/getOrUpdateZone',
  async (_, { rejectWithValue, profileAxios, getState }) => {
    const defaultLocation = geolocationCoordinatesSelector(getState());

    let urlPart = '';
    if (defaultLocation) {
      urlPart = `?Latitude=${defaultLocation.latitude}&Longitude=${defaultLocation.longitude}`;
    }
    //TODO: for test only: on back there is troubles with different ones
    try {
      const response = await profileAxios.post<GetOrUpdateZoneAPIResponse>(`/zone/up-to-date${urlPart}`);

      const zone =
        response.data.find(el => el.locationType === 'City') ?? response.data.find(el => el.locationType === 'Country');

      if (zone) {
        return zone;
      }

      return null;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const updateProfileLanguage = createAppAsyncThunk<void, string>(
  'passenger/updateProfileLanguage',
  async (payload, { rejectWithValue, profileAxios }) => {
    try {
      await profileAxios.post<void>('/profile/languages', {
        type: 0,
        value: payload,
      } as UpdateProfileLanguageAPIRequest);
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
