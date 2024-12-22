import { TrafficLevel } from 'shuttlex-integration';

import { TrafficLoadFromAPI } from '../ride/redux/trip/types';

export const trafficLoadFromAPIToTrafficLevel: Record<TrafficLoadFromAPI, TrafficLevel> = {
  Low: TrafficLevel.Low,
  Average: TrafficLevel.Average,
  High: TrafficLevel.High,
};
