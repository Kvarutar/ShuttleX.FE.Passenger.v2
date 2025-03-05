import { AppState } from '../../../redux/store.ts';

export const streamingVideosSelector = (state: AppState) => state.streaming.videos;

//Loading
export const isVideosLoadingSelector = (state: AppState) => state.streaming.loading.videos;
