import { SearchAddressFromAPI } from './../../../../../../core/ride/redux/offer/types';

export type SliderItemProps = {
  topText: string;
  bottomText: string;
  image: React.ReactNode;
};

export type StartRideVisibleProps = {
  openAddressSelect: (state: boolean) => void;
  setFastAddressSelect: (address: SearchAddressFromAPI) => void;
  isBottomWindowOpen: boolean;
};
