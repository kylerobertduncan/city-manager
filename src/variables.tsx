// export const localStorageId:string = "geojsonData";
export const localStorageId: string = "prince";
export const mapboxSourceId: string = "prince-source";
export const mapboxLayerId: string = "prince-layer";
export const mapboxPolygonLayerId: string = "prince-polygon-layer";

export interface pointProperties {
	address: string | null;
	color: string | null;
	created: number;
	id: string;
	name: string;
	notes: string | null; // maybe an array in future?
	tags: string | null; // maybe an array in future?
}

export const emptyFeatureCollection: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: [],
};

export const newPointFeature: GeoJSON.Feature = {
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