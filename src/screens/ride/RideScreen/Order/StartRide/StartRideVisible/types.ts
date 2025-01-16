import { RecentDropoffsFromAPI } from './../../../../../../core/ride/redux/offer/types';

export type SliderItemProps = {
  topText: string;
  bottomText: string;
  image: React.ReactNode;
  isTextLoading: boolean;
};

export type StartRideVisibleProps = {
  setFastAddressSelect: (address: RecentDropoffsFromAPI) => void;
  isBottomWindowOpen: boolean;
};
