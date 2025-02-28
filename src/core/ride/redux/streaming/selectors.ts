import { AppState } from '../../../redux/store.ts';

export const streamingVideosSelector = (state: AppState) => state.streaming.videos;
