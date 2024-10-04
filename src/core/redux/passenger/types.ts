export type Profile = {
  fullName: string;
  email: string;
  phone: string;
  imageUri: string;
};

export type PassengerState = {
  profile: Profile | null;
};
