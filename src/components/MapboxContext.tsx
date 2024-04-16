import mapboxgl from "mapbox-gl";
import { createContext, useContext, useState } from "react";

// add url restrictions before releasing production
// https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

// setup state for changable map properties
const [center, setCenter] = useState<mapboxgl.LngLatLike>({ lng: -79.37, lat: 43.65 });
const [zoom, setZoom] = useState(12);
// initialize new map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  center: center,
  zoom: zoom,
});
// setup map listeners for user movement
map.on("move", () => {
  setCenter(map.getCenter());
  setZoom(map.getZoom());
});

const MapboxContext = createContext(map);

export function MapboxProvider({ children }: { children: React.ReactNode[] }) {
	return <MapboxContext.Provider value={map}>{children}</MapboxContext.Provider>;
}

export function useMapbox() {
  return useContext(MapboxContext)
}
