import { createContext, RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { MapViewRef } from 'shuttlex-integration';

import { mapCarsSelector } from '../ride/redux/map/selectors';
import {
  tripDropOffRouteLastWaypointSelector,
  tripPickUpRouteLastWaypointSelector,
  tripStatusSelector,
} from '../ride/redux/trip/selectors';
import { TripStatus } from '../ride/redux/trip/types';

type MapContextType = {
  mapRef: RefObject<MapViewRef>;
  focusOnRoute: () => void;
  /**
   * If enabled, the camera will be focused between geopoint and car once when TripStatus changes to "Accepted" or "Ride"
   */
  setIsRouteAutofocusEnabled: (isEnabled: boolean) => void;
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
  const tripStatus = useSelector(tripStatusSelector);
  const mapCars = useSelector(mapCarsSelector);
  const tripPickUpRouteLastWaypoint = useSelector(tripPickUpRouteLastWaypointSelector);
  const tripDropOffRouteLastWaypoint = useSelector(tripDropOffRouteLastWaypointSelector);

  const mapRef = useRef<MapViewRef>(null);
  const contractorCarCoordinatesRef = useRef<LatLng | null>(null);

  const [isContractorCarCoordinatesAvailable, setIsContractorCarCoordinatesAvailable] = useState<boolean>(false);
  const [isRouteAutofocusEnabled, setIsRouteAutofocusEnabled] = useState<boolean>(false);

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

  const focusOnRoute = useCallback(() => {
    // If contractor geo not available - dont focus
    if (!contractorCarCoordinatesRef.current) {
      return;
    }

    const coordinates: LatLng[] = [contractorCarCoordinatesRef.current];
    if (tripStatus === TripStatus.Accepted && tripPickUpRouteLastWaypoint) {
      // Contarctor -> Pickup
      coordinates.push(tripPickUpRouteLastWaypoint.geo);
    } else if (tripStatus === TripStatus.Ride && tripDropOffRouteLastWaypoint) {
      // Pickup -> DropOff
      coordinates.push(tripDropOffRouteLastWaypoint.geo);
    }

    mapRef.current?.fitToCoordinates(coordinates);
  }, [mapRef, tripStatus, tripPickUpRouteLastWaypoint, tripDropOffRouteLastWaypoint]);

  useEffect(() => {
    if (isRouteAutofocusEnabled) {
      focusOnRoute();
    }
  }, [focusOnRoute, isRouteAutofocusEnabled, isContractorCarCoordinatesAvailable]);

  return (
    <MapContext.Provider value={{ mapRef, focusOnRoute, setIsRouteAutofocusEnabled }}>{children}</MapContext.Provider>
  );
};

export { type MapContextType, MapProvider, useMap };
