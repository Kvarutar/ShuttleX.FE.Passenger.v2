import { AppState } from '../../../redux/store';

export const mapCameraModeSelector = (state: AppState) => state.map.cameraMode;
export const mapCarsSelector = (state: AppState) => state.map.cars;
export const mapInterestingPlacesSelector = (state: AppState) => state.map.interestingPlaces;
export const mapStopPointsSelector = (state: AppState) => state.map.stopPoints;
export const mapRidePercentFromPolylinesSelector = (state: AppState) => state.map.ridePercentFromPolylines;
export const mapRouteTrafficSelector = (state: AppState) => state.map.routeTraffic;
