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
