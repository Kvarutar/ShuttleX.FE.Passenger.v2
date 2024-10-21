export type StartRideProps = {
  setIsAddressSelectVisible: (state: boolean) => void;
  isAddressSelectVisible: boolean;
};

export type StartRideRef = {
  openAddressSelect: () => void;
};
