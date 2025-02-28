import { createSlice } from '@reduxjs/toolkit';

import { getVideos } from './thunks.ts';
import { StreamingState } from './types.ts';

const initialState: StreamingState = {
  videos: [],
};

const slice = createSlice({
  name: 'streaming',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getVideos.fulfilled, (state, action) => {
      state.videos = action.payload;
    });
  },
});

export default slice.reducer;
