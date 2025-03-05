export type StreamingState = {
  videos: VideosFromAPI[];
  loading: {
    videos: boolean;
  };
};

export type VideosFromAPI = {
  vodManifestUrl: string;
  name: string;
  description: string;
};

export type VideosAPIResponse = {
  vodManifests: VideosFromAPI[];
};
