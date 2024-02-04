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
  })
}

export function zoomToAll(map: mapboxgl.Map) {
  const data:GeoJSON.FeatureCollection = getLocalStorage();
  console.log("bbox data:", data);
  if (!data.features.length) {
    return;
  }
  const box:GeoJSON.BBox = bbox(data);
  // const bounds:mapboxgl.LngLatBoundsLike = box.map(b => { return b});
  box.forEach(b => {
    console.log("bbox box:", b, typeof(b));
    // if (bounds.length > 3) return;
  });

  // map.fitBounds(bounds, {});
}
