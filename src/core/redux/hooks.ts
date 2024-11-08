// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch } from 'react-redux';
import { initCreateAppAsyncThunk } from 'shuttlex-integration';

import axiosInitilizers from '../client';
import { AppDispatch, AppState } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;

export const createAppAsyncThunk = initCreateAppAsyncThunk<AppState, AppDispatch, typeof axiosInitilizers>(
  axiosInitilizers,
);
