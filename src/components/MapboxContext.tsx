import { createContext, useContext } from "react";
import { MapController } from "../modules/mapController";

export const MapboxContext = createContext<MapController >(null!);

// export function MapboxProvider({ children }: { children: React.ReactNode[] }) {
// 	return <MapboxContext.Provider value={null}>{children}</MapboxContext.Provider>;
// }

export function useMapbox() {
  return useContext(MapboxContext)
}
