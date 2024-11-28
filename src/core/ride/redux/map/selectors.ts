import { AppState } from '../../../redux/store';

export const mapCameraModeSelector = (state: AppState) => state.map.cameraMode;
export const mapCarsSelector = (state: AppState) => state.map.cars;
export const mapPolylinesSelector = (state: AppState) => state.map.polylines;
export const mapStopPointsSelector = (state: AppState) => state.map.stopPoints;
