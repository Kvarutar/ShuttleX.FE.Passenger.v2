import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { MapPolyline, MapViewRef } from 'shuttlex-integration';

import { mapCarsSelector } from '../ride/redux/map/selectors';

type MapContextType = {
  mapRef: RefObject<MapViewRef>;
  mapPolyline: MapPolyline | null;
  setMapPolyline: Dispatch<SetStateAction<MapPolyline | null>>;
  fitToPolyline: (options?: { onlyWhenCarGeoAvailable?: boolean }) => void;
  // focusOnRoute: () => void;
  /**
   * If enabled, the camera will be focused between geopoint and car once when TripStatus changes to "Accepted" or "Ride"
   */
  // setIsRouteAutofocusEnabled: (isEnabled: boolean) => void;
};

const MapContext = createContext<MapContextType | null>(null);

const useMap = (): MapContextType => {
  const value = useContext(MapContext);
  if (!value) {
    throw new Error('useMap must be wrapped in a <MapProvider />');
  }
  return value;
};

type MapProviderProps = {
  children: React.ReactNode;
};

const MapProvider = ({ children }: MapProviderProps): JSX.Element => {
  // const tripStatus = useSelector(tripStatusSelector);
  const mapCars = useSelector(mapCarsSelector);
  // const tripPickUpRouteLastWaypoint = useSelector(tripPickUpRouteLastWaypointSelector);
  // const tripDropOffRouteLastWaypoint = useSelector(tripDropOffRouteLastWaypointSelector);
  // const tripPickUpRoute = useSelector(tripPickUpRouteSelector);
  // const tripDropOffRoute = useSelector(tripDropOffRouteSelector);

  const mapRef = useRef<MapViewRef>(null);
  const contractorCarCoordinatesRef = useRef<LatLng | null>(null);
  const polylineRef = useRef<MapPolyline | null>(null);

  const [isContractorCarCoordinatesAvailable, setIsContractorCarCoordinatesAvailable] = useState<boolean>(false);
  // const [isRouteAutofocusEnabled, setIsRouteAutofocusEnabled] = useState<boolean>(false);
  const [polyline, setPolyline] = useState<MapPolyline | null>(null);

  // contractorCarCoordinatesRef only needed to avoid putting it inside the useEffect hook below
  useEffect(() => {
    contractorCarCoordinatesRef.current = mapCars.length > 0 ? mapCars[0].coordinates : null;
    if (mapCars.length > 0) {
      contractorCarCoordinatesRef.current = mapCars[0].coordinates;
      setIsContractorCarCoordinatesAvailable(true);
    } else {
      contractorCarCoordinatesRef.current = null;
      setIsContractorCarCoordinatesAvailable(false);
    }
  }, [mapCars]);

  useEffect(() => {
    polylineRef.current = polyline;
  }, [polyline]);

  const fitToPolyline = useCallback<MapContextType['fitToPolyline']>(
    options => {
      if (!polylineRef.current || !('coordinates' in polylineRef.current.options)) {
        return;
      }
      if (options?.onlyWhenCarGeoAvailable) {
        if (isContractorCarCoordinatesAvailable) {
          mapRef.current?.fitToCoordinates(polylineRef.current.options.coordinates);
        }
        return;
      }
      mapRef.current?.fitToCoordinates(polylineRef.current.options.coordinates);
    },
    [isContractorCarCoordinatesAvailable],
  );

  // const focusOnRoute = useCallback(() => {
  //   if (contractorCarCoordinatesRef.current && tripStatus === TripStatus.Arrived) {
  //     mapRef.current?.animateCamera(
  //       { center: contractorCarCoordinatesRef.current },
  //       { duration: mapConstants.cameraAndPositionAnimationDuration },
  //     );
  //   }

  //   // If contractor geo not available or bad status - dont focus
  //   if (
  //     !contractorCarCoordinatesRef.current ||
  //     !(tripStatus === TripStatus.Accepted || tripStatus === TripStatus.Ride)
  //   ) {
  //     return;
  //   }

  //   const coordinates: LatLng[] = [contractorCarCoordinatesRef.current];
  //   if (polylineRef.current && 'coordinates' in polylineRef.current.options) {
  //     coordinates.push(...polylineRef.current.options.coordinates);
  //   }

  //   mapRef.current?.fitToCoordinates(coordinates);
  // }, [mapRef, tripStatus]);

  // useEffect(() => {
  //   if (isRouteAutofocusEnabled) {
  //     focusOnRoute();
  //   }
  // }, [focusOnRoute, isRouteAutofocusEnabled, isContractorCarCoordinatesAvailable, isPolylineRendered]);

  return (
    <MapContext.Provider
      value={{
        mapRef,
        mapPolyline: polyline,
        setMapPolyline: setPolyline,
        fitToPolyline,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export { type MapContextType, MapProvider, useMap };
