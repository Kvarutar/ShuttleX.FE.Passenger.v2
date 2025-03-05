export type StreamingState = {
  videos: string[];
  loading: {
    videos: boolean;
  };
};

export type VideosAPIResponse = {
  vodManifestUrls: string[];
};
