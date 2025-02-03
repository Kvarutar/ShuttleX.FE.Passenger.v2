import { TariffType } from 'shuttlex-integration';

import { MatchingAlgorythm, TariffFeKeyFromAPI } from '../types';

export const tariffsNamesByFeKey: Record<TariffFeKeyFromAPI, TariffType> = {
  basicx: 'Basic',
  basicxl: 'BasicXL',
  comfortplus: 'ComfortPlus',
  electric: 'Electric',
  businessx: 'BusinessX',
  businesselite: 'BusinessElite',
  comforteco: 'ComfortEco',
};

export const algorythmTypeParser = (algorythmTypeFromBackend: number): MatchingAlgorythm => {
  switch (algorythmTypeFromBackend) {
    case 1:
      return 'Eager Fast';
    case 2:
      return 'Hungarian';
    default:
      return 'Eager Cheap';
  }
};
