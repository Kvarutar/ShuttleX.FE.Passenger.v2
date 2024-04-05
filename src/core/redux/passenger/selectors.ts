import { AppState } from '../store';

export const profileSelector = (state: AppState) => state.passenger.profile;
