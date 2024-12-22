import {
  AirPodsImage,
  AirPodsMaxImage,
  AirPodsProImage,
  AirTagImage,
  BagImage,
  BottleImage,
  DeskLampImage,
  HoodieImage,
  iPhone16ProImage,
  MugImage,
  ToteBagImage,
  TshirtImage,
} from '../../../../assets/images/surprises';
import { PrizeData } from './types';

export const prizesData: Record<string, PrizeData> = {
  iPhone16Pro: {
    name: 'raffle_Lottery_prizeiPhone16Pro',
    image: iPhone16ProImage,
    description: 'raffle_Lottery_prizeiPhone16ProDesc',
  },
  AirPods: {
    name: 'raffle_Lottery_prizeAirPods',
    image: AirPodsImage,
    description: 'raffle_Lottery_prizeAirPodsDesc',
  },
  AirPodsMax: {
    name: 'raffle_Lottery_prizeAirPodsMax',
    image: AirPodsMaxImage,
    description: 'raffle_Lottery_prizeAirPodsMaxDesc',
  },
  AirPodsPro: {
    name: 'raffle_Lottery_prizeAirPodsPro',
    image: AirPodsProImage,
    description: 'raffle_Lottery_prizeAirPodsProDesc',
  },
  AirTag: {
    name: 'raffle_Lottery_prizeAirTag',
    image: AirTagImage,
    description: 'raffle_Lottery_prizeAirTagDesc',
  },
  Bottle: {
    name: 'raffle_Lottery_prizeBottle',
    image: BottleImage,
    description: 'raffle_Lottery_prizeBottleDesc',
  },
  DeskLamp: {
    name: 'raffle_Lottery_prizeDeskLamp',
    image: DeskLampImage,
    description: 'raffle_Lottery_prizeDeskLampDesc',
  },
  Hoodie: {
    name: 'raffle_Lottery_prizeHoodie',
    image: HoodieImage,
    description: 'raffle_Lottery_prizeHoodieDesc',
  },
  Tshirt: {
    name: 'raffle_Lottery_prizeTshirt',
    image: TshirtImage,
    description: 'raffle_Lottery_prizeTshirtDesc',
  },
  Mug: {
    name: 'raffle_Lottery_prizeMug',
    image: MugImage,
    description: 'raffle_Lottery_prizeMugDesc',
  },
  Bag: {
    name: 'raffle_Lottery_prizeBag',
    image: BagImage,
    description: 'raffle_Lottery_prizeBagDesc',
  },
  ToteBag: {
    name: 'raffle_Lottery_prizeToteBag',
    image: ToteBagImage,
    description: 'raffle_Lottery_prizeToteBagDesc',
  },
};
