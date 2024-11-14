import { AppState } from '../store';

export const profileSelector = (state: AppState) => state.passenger.profile;
export const profilePhotoSelector = (state: AppState) => state.passenger.profile?.imageUri;
