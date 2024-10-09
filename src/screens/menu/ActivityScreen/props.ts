import { TariffType } from 'shuttlex-integration';

export type RecentTrip = {
  address: string;
  details: string;
  status: null | number;
  date: Date;
  tripType: TariffType;
};

export type RecentAddressesProps = {
  trip: RecentTrip;
};
