import { AppState } from '../store';

export const contractorCoordinatesSelector = (state: AppState) => state.signalR.contractorCoordinates;
export const contractorsCarsSelector = (state: AppState) => state.signalR.contractorsCars;
