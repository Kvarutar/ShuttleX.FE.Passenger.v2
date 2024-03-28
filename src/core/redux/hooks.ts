import { createAsyncThunk } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch } from 'react-redux';

import { AppDispatch, AppState } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppState;
  dispatch: AppDispatch;
}>();
