import { createContext, RefObject, useContext, useRef } from 'react';
import { MapViewRef } from 'shuttlex-integration';

type MapContextType = {
  mapRef: RefObject<MapViewRef>;
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
  const mapRef = useRef<MapViewRef>(null);

  return <MapContext.Provider value={{ mapRef }}>{children}</MapContext.Provider>;
};

export { type MapContextType, MapProvider, useMap };
