// export const localStorageId:string = "geojsonData";
export const localStorageId: string = "prince"; // update to prxs?
export const mapboxSourceId: string = "prxs-source";
export const mapboxPointLayerId: string = "prxs-point-layer";
export const mapboxPolygonLayerId: string = "prxs-polygon-layer";

// polygon draft ids
/*
  layers:
    - points for each click (circle): newPolygonCoordinates
    - lines between added points (line): newPolygonCoordinates
    - line(s) from added points and cursor (line)
    - - one line after first click: last point + cursor lngLat, OR
    - - two after second click: last point + cursor lngLat + first point
*/
// good for both multiPoint and lineString?
// -- make a feature collection with both, same coordinates
export const newPolygonSource: string = "prxs-newPolygon-source";
export const newPolygonPointLayer: string = "prxs-newPolygon-circle";
export const newPolygonLineLayer: string = "prxs-newPolygon-line";
export const liveLineSource: string = "prxs-liveLine-source";
export const liveLineLayer: string = "prxs-liveLine-layer";
// maybe add a point layer as well?

export interface featureProperties {
	address?: string;
	bbox?: number[];
	center?: number[];
	color?: string;
	created: number;
	id: string;
	name: string;
	notes?: string; // maybe an array in future?
	tags?: string; // maybe an array in future?
}

export interface firebaseData {
  created: number,
  geojson: string,
  uuid: string,
}

export const emptyFeatureProperties:featureProperties = {
  address: "",
  color: "",
  created: 0,
  id: "",
  name: "",
  notes: "",
  tags: "",
}

export const emptyFeatureCollection: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: [],
};

export const newFeature: GeoJSON.Feature = {
	type: "Feature",
	geometry: {
		type: "Point",
		coordinates: [],
	},
	properties: {
		address: "",
		color: "",
		created: 0,
		id: "",
		name: "",
		notes: [],
		tags: [],
	},
};

export const mapboxLayers = [
	"land (background)",
	"landcover (fill)",
	"national-park (fill)",
	"landuse (fill)",
	"water-shadow (fill)",
	"waterway (line)",
	"water (fill)",
	"hillshade (fill)",
  // MY POLYGON LAYER
	"prxs-polygon-layer (fill)",
  // LAND STRUCTURES ??
	"land-structure-polygon (fill)",
	"land-structure-line (line)",
  // AIRPORTS
	"aeroway-polygon (fill)",
	"aeroway-line (line)",
  // BUILDINGS
	"building-outline (line)",
	"building (fill)",
  // TUNNELS, ROADS & BRIDGES
	"tunnel-street-minor-low (line)",
	"tunnel-street-minor-case (line)",
	"tunnel-primary-secondary-tertiary-case (line)",
	"tunnel-major-link-case (line)",
	"tunnel-motorway-trunk-case (line)",
	"tunnel-construction (line)",
	"tunnel-path (line)",
	"tunnel-steps (line)",
	"tunnel-major-link (line)",
	"tunnel-pedestrian (line)",
	"tunnel-street-minor (line)",
	"tunnel-primary-secondary-tertiary (line)",
	"tunnel-motorway-trunk (line)",
	"road-pedestrian-case (line)",
	"road-minor-low (line)",
	"road-street-low (line)",
	"road-minor-case (line)",
	"road-street-case (line)",
	"road-secondary-tertiary-case (line)",
	"road-primary-case (line)",
	"road-major-link-case (line)",
	"road-motorway-trunk-case (line)",
	"road-construction (line)",
	"road-path (line)",
	"road-steps (line)",
	"road-major-link (line)",
	"road-pedestrian (line)",
	"road-minor (line)",
	"road-street (line)",
	"road-secondary-tertiary (line)",
	"road-primary (line)",
	"road-motorway-trunk (line)",
	"road-rail (line)",
	"bridge-pedestrian-case (line)",
	"bridge-street-minor-low (line)",
	"bridge-street-minor-case (line)",
	"bridge-primary-secondary-tertiary-case (line)",
	"bridge-major-link-case (line)",
	"bridge-motorway-trunk-case (line)",
	"bridge-construction (line)",
	"bridge-path (line)",
	"bridge-steps (line)",
	"bridge-major-link (line)",
	"bridge-pedestrian (line)",
	"bridge-street-minor (line)",
	"bridge-primary-secondary-tertiary (line)",
	"bridge-motorway-trunk (line)",
	"bridge-rail (line)",
	"bridge-major-link-2-case (line)",
	"bridge-motorway-trunk-2-case (line)",
	"bridge-major-link-2 (line)",
	"bridge-motorway-trunk-2 (line)",
  // ADMIN BOUNDARIES ??
	"admin-1-boundary-bg (line)",
	"admin-0-boundary-bg (line)",
	"admin-1-boundary (line)",
	"admin-0-boundary (line)",
	"admin-0-boundary-disputed (line)",
  // MY LOCATION LAYER(S)
	"prxs-layer (circle)",
	"prxs-layer-trigger (circle)",
  // LABELS
	"road-label (symbol)",
	"waterway-label (symbol)",
	"natural-line-label (symbol)",
	"natural-point-label (symbol)",
	"water-line-label (symbol)",
	"water-point-label (symbol)",
	"poi-label (symbol)",
	"airport-label (symbol)",
	"settlement-subdivision-label (symbol)",
	"settlement-label (symbol)",
	"state-label (symbol)",
	"country-label (symbol)",
];