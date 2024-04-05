export type Profile = {
  imageUri: string;
  name: string;
  surname: string;
};

export type PassengerState = {
  profile: Profile | null;
};
