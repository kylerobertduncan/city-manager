import { bbox } from "@turf/turf";
import { getLocalStorage } from "./localStorage";
import mapboxgl from "mapbox-gl";

const sourceID = "prince-source";
const layerID = "prince-layer";

export function updateMap(geojson:GeoJSON.FeatureCollection) {

}

export function addSource(map: mapboxgl.Map) {
  map.addSource(sourceID, {
    type: "geojson",
    data: getLocalStorage(),
  });
}

export function addLayer(map: mapboxgl.Map) {
  map.addLayer({
    id: layerID,
    source: sourceID,
    type: "circle",
    paint: {
      "circle-color": "blue"
    }
  }, "road-label");
}

export function zoomToAll(map: mapboxgl.Map) {
  const data:GeoJSON.FeatureCollection = getLocalStorage();
  if (!data.features.length) return;
  // const box:mapboxgl.LngLatBoundsLike | GeoJSON.BBox = bbox(data);
  const box = bbox(data);
  // const bounds:mapboxgl.LngLatBoundsLike = box.map(b => { return b});
  
  map.fitBounds(box, {});
}
