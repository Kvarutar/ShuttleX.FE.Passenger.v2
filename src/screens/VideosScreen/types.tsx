import { VideosFromAPI } from '../../core/ride/redux/streaming/types.ts';

export type VideoCardProps = {
  videoData: VideosFromAPI;
  isActive: boolean;
};

export type BitmovinPlayerProps = {
  videoUrl: string;
  isActive: boolean;
  pause: boolean;
};
