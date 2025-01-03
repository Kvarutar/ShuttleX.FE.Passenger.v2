import { AppState } from '../../redux/store';

export const profileSelector = (state: AppState) => state.passenger.profile;
export const profileZoneSelector = (state: AppState) => state.passenger.zone;
export const profilePrefferedNameSelector = (state: AppState) =>
  state.passenger.profile?.names?.find(name => name.type === 'Preferred')?.value;
export const profileSelectedPhotoSelector = (state: AppState) =>
  state.passenger.profile?.avatars?.find(avatar => avatar.type === 'Selected')?.value;
export const profileContactPhoneSelector = (state: AppState) =>
  state.passenger.profile?.phones?.find(phone => phone.type === 'Contact')?.value;
export const profileContactEmailSelector = (state: AppState) =>
  state.passenger.profile?.emails?.find(email => email.type === 'Contact')?.value;
export const passengerZoneSelector = (state: AppState) => state.passenger.zone;
export const ordersHistorySelector = (state: AppState) => state.passenger.ordersHistory;

//Loadings
export const isPassengerAvatarLoadingSelector = (state: AppState) => state.passenger.loading.passengerAvatar;
export const isPassengerInfoLoadingSelector = (state: AppState) => state.passenger.loading.passengerInfo;
export const isPassengerGeneralLoadingSelector = (state: AppState) => state.passenger.loading.general;
export const isOrdersHistoryLoadingSelector = (state: AppState) => state.passenger.loading.ordersHistory;

//Errors
export const passengerGeneralErrorSelector = (state: AppState) => state.passenger.error.general;
export const passengerAvatarErrorSelector = (state: AppState) => state.passenger.error.passengerAvatar;
export const passengerInfoErrorSelector = (state: AppState) => state.passenger.error.passengerInfo;

//UI
export const isLoadingStubVisibleSelector = (state: AppState) => state.passenger.ui.isLoadingStubVisible;
export const activeBottomWindowYCoordinateSelector = (state: AppState) =>
  state.passenger.ui.activeBottomWindowYCoordinate;
