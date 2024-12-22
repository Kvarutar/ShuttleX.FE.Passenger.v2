import { RecentDropoffsFromAPI } from './../../../../../../core/ride/redux/offer/types';

export type SliderItemProps = {
  topText: string;
  bottomText: string;
  image: React.ReactNode;
  isTextLoading: boolean;
};

export type StartRideVisibleProps = {
  openAddressSelect: (state: boolean) => void;
  setFastAddressSelect: (address: RecentDropoffsFromAPI) => void;
  isBottomWindowOpen: boolean;
};
