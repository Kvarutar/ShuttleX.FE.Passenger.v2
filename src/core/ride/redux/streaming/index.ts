import { createSlice } from '@reduxjs/toolkit';

import { getVideos } from './thunks.ts';
import { StreamingState } from './types.ts';

const initialState: StreamingState = {
  videos: [],
  loading: {
    videos: false,
  },
};

const slice = createSlice({
  name: 'streaming',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getVideos.pending, state => {
        state.loading.videos = true;
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.videos = action.payload;
        state.loading.videos = false;
      })
      .addCase(getVideos.rejected, state => {
        state.loading.videos = false;
      });
  },
});

export default slice.reducer;
