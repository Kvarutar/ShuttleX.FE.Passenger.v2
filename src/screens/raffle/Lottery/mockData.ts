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
import { Prize, Winner } from './types';

export const surprisesMock: Prize[] = [
  {
    id: '0',
    name: 'iPhone 16 Pro',
    image: firstSurprise,
    description: null,
    index: 1,
  },
  {
    id: '1',
    name: 'iPhone 16',
    image: secondSurprise,
    description: null,
    index: 2,
  },
  {
    id: '2',
    name: 'iPhone 15',
    image: thirdSurprise,
    description: null,
    index: 3,
  },
  {
    id: '3',
    name: 'Nothing Ear (2) ',
    image: fourthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
    index: 4,
  },
  {
    id: '4',
    name: 'Nothing Ear (2)',
    image: fifthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
    index: 5,
  },
  {
    id: '5',
    name: 'Nothing Ear A',
    image: sixthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
    index: 6,
  },
  {
    id: '6',
    name: 'AirPods 1',
    image: seventhSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
    index: 7,
  },
  {
    id: '7',
    name: 'Ear (open)',
    image: tenthSurprises,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
    index: 8,
  },
  {
    id: '8',
    name: 'Nothing Ear (2)',
    image: ninthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
    index: 9,
  },
  {
    id: '9',
    name: 'Nothing Ear (2)',
    image: eighthSurprise,
    description:
      'The Nothing Ear (a) Yellow are made for all parts of the day. The unique transparent design and slim rectangular size make the Ear (a) earplugs ideal for the music lover.',
    index: 10,
  },
];

export const winnersMock: Winner[] = [
  {
    id: '0',
    name: 'John',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/01bd/c4f3/510d85fbf3f0512b386dbc3a82ae77ea?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ht2Qqv~HeEIkLhDg6yjZfHjc-Y5ph6CYiut5BuE07M1BFSVoLUZ963ySAajS4WlNtL6SivnRGtJIfcGPzLRDlVYfXlWaIPhxLf7pWQySV4QDPfla6NK0vF7zxeX~dDE1EYMoCIt~6Cg9MmQ6qkeqNjjddUJMNDzMRVkdihfJlvWYd1j23lJ84GxsoaJwmfFG1-fb2zKqfHHPbGKqtYo-yOJ13Kwgx~dDkkMlj5a5WsZV~p2wdySNtJZBgPY-NKQ4PiuL3xmdHfVV8zAV7ZrsZx9MZB04WJpuy2v5AcKtBe6jbBP2EHiIVoHjG-qJ0r3Xrmn4E7JOZiEQew70rP0V~w__',
    ticketCode: '12312332',
  },
  {
    id: '10',
    name: 'John',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/01bd/c4f3/510d85fbf3f0512b386dbc3a82ae77ea?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ht2Qqv~HeEIkLhDg6yjZfHjc-Y5ph6CYiut5BuE07M1BFSVoLUZ963ySAajS4WlNtL6SivnRGtJIfcGPzLRDlVYfXlWaIPhxLf7pWQySV4QDPfla6NK0vF7zxeX~dDE1EYMoCIt~6Cg9MmQ6qkeqNjjddUJMNDzMRVkdihfJlvWYd1j23lJ84GxsoaJwmfFG1-fb2zKqfHHPbGKqtYo-yOJ13Kwgx~dDkkMlj5a5WsZV~p2wdySNtJZBgPY-NKQ4PiuL3xmdHfVV8zAV7ZrsZx9MZB04WJpuy2v5AcKtBe6jbBP2EHiIVoHjG-qJ0r3Xrmn4E7JOZiEQew70rP0V~w__',
    ticketCode: '12312332',
  },
  {
    id: '1',
    name: 'Jane',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/ad86/30e4/4cd4da218e9d726fdc7222a3aef46e4d?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=khaFHcl6QIMQsMh2iteI1ZmZb-SQjD5yLZ6fYRxaxtyGXTOnqaT-GLCe1f54jaL7RBF7HhurXjHaWN7x7zCUeuykppujzbGgZSD1QR8g7vBdQXF6dL2~ChtvQMhgh1ZEvIph5TqXo781v49qTK1iQa2AizCLIbEHxms1vZsvvOWVGwJLX-jTluWrN4NbwFZv8L-jHvZyXiybK~eZ0dD6wJKCC~b5ETJjiCNklSl8pSEsIlVpPNZ5z5noPfQLO2zBVlMXhrNQGHRSQSAbeMamWcmv3TFEwOBQzzb3Y4wH6jsjYB3oNfyCEgX8VqmBodAKHLYkX42oxXzflvq24vHpdw__',
    ticketCode: '12312332',
  },
  {
    id: '2',
    name: 'Alice',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/23f9/d9bd/724b559cff4359676a18f3259c6ecbb8?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dJWL3FUNEZvmXFihEaTPiDmfMqKDg-d9tfS~RG79qwQT6U3OYVMyTwOW0sG2EMCwHahgTvheQ6Dz-w8oVPZrGrC7HfmoVsesmrG0S0qotsGyX9TT3VFZSZGVvd~47hEUzxm9rGEKI-v3Lo-GsR6FUD8X-QhCf1paTUhG7WZfY4oDSRLgb-gdUT6S4gr9rsmj2mlALTeSPhebfFh23LJGqCVF-yp0kdlaFQDiz2JVWU3heNQFEsKlu~HKoeIXzyejnlgY5OcUflBYGsQ3oIukoeZLuRy-8iTVzWp1IcsiRyuucOZNtnnN56qp4w5xXtMuiVFIssJzMISuwbEHv4xG5Q__',
    ticketCode: '12312332',
  },
  {
    id: '3',
    name: 'Bob',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/3eee/57eb/8f00319b00c6ab48c9225cdd9c5842b5?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UgwIzCVu-g2vpqjyq-wPKapC45um8NII4tJuRPGhBgu5HVYI~HeEXEXAgH7rl8GjGeTV2Zx6uGd0b1yX8yvLwEjM82Ehud8CwG9eHVAD88TjRUZ5ePrL4L6hJbu9uvWHEkmyea2sXkEtdX-LLFa4hL0Tsk0ipG~chg8dC8oZClfp15zzAamNsG0UsgZXoudQZxpmFGqvd3hOOT28jpcxT5XAyPbFW~8eWj~ULLzflUOJKIx3ZxjGcbg--PZMhSutMnX2eYmFfAe4DSCfI5DdIlHINd0DrEuhUKeKYWn9-mOro4PmEHVFcfjJVZYpZLZekyYEfgrAMnqvMgFbZu7mAg__',
    ticketCode: '12312332',
  },
  {
    id: '4',
    name: 'Charlie',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/1726/0d13/4d79c66c54d6331e6867c04e24560e33?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X797Rurzt8kwQg7LwWbHzqQ-H6thNA35fCUJCKbUWBtmQrCfNaQ2aQSswyE-Tjm2mk7Enrj61PJuRVO-U2PI~-6vQsNRz7TwhvKvyKoe78Z9CiOkXkD8AvvIJ4PkyW6gobg8KlZf~cpQ-fcVtBVlsi74FweA5iOtLHHqfhN3zZrj3IVUYfXJi6TRLOFC1lVbIXFwnWOAz5iRCvZmakacALYGFLFaaARhoJLx9mSYWo4GAlmSBLWw5zcdj1xqbG770117GkGEP6K5CfuXahWJ~Gw~uLoMapm-~fKcRrLoQLOYSRNSN31qjpuPj5RyjMcwcYcaAlEL0YZH50CZ0WVxvA__',
    ticketCode: '12312332',
  },

  {
    id: '5',
    name: 'Dave',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/9835/d02d/e1ba90b779b1bcd98dacd75f9571d36f?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lC8ZMXh9ZWH32sFd-BzEE3pYQrxGeRaSnoOKW6kskYcxdp-~0tFieiKpJOOHe158GojSuwnNHLcCHsTUhNGoJYRXC0EC8ZxsXrlgrXEvorAISaoYKRoj1kQa~eOXq8JxfLyDoAAJ8OoYaN1aL2OHBX5IWQtGD68hs7vcOSPxFPcId-kF7B9kLFV2YwsazlrfU41tH4wSggLH6SSPIRPQDEOoCWBgUZXHcOMGw0SBSA4NCXD~XtV-0viRVZ5yBDLRuxNTaOwGdcmQ1vnFZze7-53nIH1wfYJlt5LldjHKdwlClpjhZ1C38LCgwPyalVqX9HTiBDzf5imXamwCKFZX-g__',
    ticketCode: '12312332',
  },
  {
    id: '6',
    name: 'Eve',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/1726/0d13/4d79c66c54d6331e6867c04e24560e33?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X797Rurzt8kwQg7LwWbHzqQ-H6thNA35fCUJCKbUWBtmQrCfNaQ2aQSswyE-Tjm2mk7Enrj61PJuRVO-U2PI~-6vQsNRz7TwhvKvyKoe78Z9CiOkXkD8AvvIJ4PkyW6gobg8KlZf~cpQ-fcVtBVlsi74FweA5iOtLHHqfhN3zZrj3IVUYfXJi6TRLOFC1lVbIXFwnWOAz5iRCvZmakacALYGFLFaaARhoJLx9mSYWo4GAlmSBLWw5zcdj1xqbG770117GkGEP6K5CfuXahWJ~Gw~uLoMapm-~fKcRrLoQLOYSRNSN31qjpuPj5RyjMcwcYcaAlEL0YZH50CZ0WVxvA__',
    ticketCode: '12312332',
  },
  {
    id: '7',
    name: 'Frank',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/1726/0d13/4d79c66c54d6331e6867c04e24560e33?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X797Rurzt8kwQg7LwWbHzqQ-H6thNA35fCUJCKbUWBtmQrCfNaQ2aQSswyE-Tjm2mk7Enrj61PJuRVO-U2PI~-6vQsNRz7TwhvKvyKoe78Z9CiOkXkD8AvvIJ4PkyW6gobg8KlZf~cpQ-fcVtBVlsi74FweA5iOtLHHqfhN3zZrj3IVUYfXJi6TRLOFC1lVbIXFwnWOAz5iRCvZmakacALYGFLFaaARhoJLx9mSYWo4GAlmSBLWw5zcdj1xqbG770117GkGEP6K5CfuXahWJ~Gw~uLoMapm-~fKcRrLoQLOYSRNSN31qjpuPj5RyjMcwcYcaAlEL0YZH50CZ0WVxvA__',
    ticketCode: '12312332',
  },
  {
    id: '8',
    name: 'Grace',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/1726/0d13/4d79c66c54d6331e6867c04e24560e33?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X797Rurzt8kwQg7LwWbHzqQ-H6thNA35fCUJCKbUWBtmQrCfNaQ2aQSswyE-Tjm2mk7Enrj61PJuRVO-U2PI~-6vQsNRz7TwhvKvyKoe78Z9CiOkXkD8AvvIJ4PkyW6gobg8KlZf~cpQ-fcVtBVlsi74FweA5iOtLHHqfhN3zZrj3IVUYfXJi6TRLOFC1lVbIXFwnWOAz5iRCvZmakacALYGFLFaaARhoJLx9mSYWo4GAlmSBLWw5zcdj1xqbG770117GkGEP6K5CfuXahWJ~Gw~uLoMapm-~fKcRrLoQLOYSRNSN31qjpuPj5RyjMcwcYcaAlEL0YZH50CZ0WVxvA__',
    ticketCode: '12312332',
  },
  {
    id: '9',
    name: 'Grace',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/1726/0d13/4d79c66c54d6331e6867c04e24560e33?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X797Rurzt8kwQg7LwWbHzqQ-H6thNA35fCUJCKbUWBtmQrCfNaQ2aQSswyE-Tjm2mk7Enrj61PJuRVO-U2PI~-6vQsNRz7TwhvKvyKoe78Z9CiOkXkD8AvvIJ4PkyW6gobg8KlZf~cpQ-fcVtBVlsi74FweA5iOtLHHqfhN3zZrj3IVUYfXJi6TRLOFC1lVbIXFwnWOAz5iRCvZmakacALYGFLFaaARhoJLx9mSYWo4GAlmSBLWw5zcdj1xqbG770117GkGEP6K5CfuXahWJ~Gw~uLoMapm-~fKcRrLoQLOYSRNSN31qjpuPj5RyjMcwcYcaAlEL0YZH50CZ0WVxvA__',
    ticketCode: '12312332',
  },
];
