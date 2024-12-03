import {
  eighthSurprise,
  fifthSurprise,
  firstSurprise,
  fourthSurprise,
  ninthSurprise,
  secondSurprise,
  seventhSurprise,
  sixthSurprise,
  tenthSurprises,
  thirdSurprise,
} from '../../../../assets/images/surprises';
import { PrizeData } from './types';

export const prizesData: Record<string, PrizeData> = {
  'iPhone 16 Pro': {
    name: 'iPhone 16 Pro',
    image: firstSurprise,
    description: null,
  },
  'iPhone 16': {
    name: 'iPhone 16',
    image: secondSurprise,
    description:
      'The iPhone 16 display has rounded corners that follow a beautiful curved design, and these corners are within a standard rectangle.',
  },
  'iPhone 15': {
    name: 'iPhone 15',
    image: thirdSurprise,
    description: null,
  },
  'Nothing Ear (2)': {
    name: 'Nothing Ear (2)',
    image: fourthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
  },
  'Nothing Ear (3)': {
    name: 'Nothing Ear (3)',
    image: fifthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
  },
  'Nothing Ear A': {
    name: 'Nothing Ear A',
    image: sixthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
  },
  'AirPods 1': {
    name: 'AirPods 1',
    image: seventhSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
  },
  'Ear (open2)': {
    name: 'Ear (open2)',
    image: eighthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
  },
  'Ear (open3)': {
    name: 'Ear (open3)',
    image: ninthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
  },
  'Ear (open)': {
    name: 'Ear (open)',
    image: tenthSurprises,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
  },
};
