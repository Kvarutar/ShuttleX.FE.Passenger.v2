import { OrderWithTariffInfo } from '../../../core/ride/redux/trip/types';

export type RecentAddressesProps = {
  order: OrderWithTariffInfo;
};

export type RideStatusTranslateKey = 'menu_Activity_Enroute' | 'menu_Activity_Arrived' | 'menu_Activity_Driving';
