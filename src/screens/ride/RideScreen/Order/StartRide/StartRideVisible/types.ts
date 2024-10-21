import { PlaceType } from '../../PlaceBar/types';

export type SliderItemProps = {
  topText: string;
  bottomText: string;
  image: React.ReactNode;
};

export type StartRideVisibleProps = {
  openAddressSelect: (state: boolean) => void;
  setFastAddressSelect: (address: PlaceType) => void;
  isBottomWindowOpen: boolean;
};
