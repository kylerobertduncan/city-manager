import { bbox, centerOfMass } from "@turf/turf";
import { v4 as uuid } from "uuid";
import { featureProperties } from "../variables";

export class GeojsonController {
	geojson: GeoJSON.FeatureCollection;
	setGeojson: (geojson: GeoJSON.FeatureCollection) => void;

	constructor(geojsonData: GeoJSON.FeatureCollection, setGeojsonData: (geojson: GeoJSON.FeatureCollection) => void) {
		// does this create a reference to the value in state,
		// or a copy in the class object?
		// I guess whenever setGeojsonData is called the app with
		// re-render triggering the class to rebuild with the new data
		this.geojson = geojsonData;
		this.setGeojson = setGeojsonData;
	}

	get data() {
		return this.geojson;
	}

	set data(geojson: GeoJSON.FeatureCollection) {
		this.geojson = geojson;
	}

	// add a new point feature
	addPointFeature(coordinates: number[], properties: featureProperties) {
		// build new feature object
		const newFeature: GeoJSON.Feature = {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: coordinates,
			},
			properties: {
				...properties,
				center: coordinates,
				created: Date.now(),
				id: uuid(),
			},
		};
		// rebuild data with new feature
		const newData = { ...this.geojson };
		newData.features.push(newFeature);
		// update data in state
		this.setGeojson(newData);
	}

	// add a new polygon feature
	addPolygonFeature(coordinates: number[][], properties: featureProperties) {
		// build new feature object
		const newFeature: GeoJSON.Feature = {
			type: "Feature",
			geometry: {
				type: "Polygon",
				coordinates: [coordinates],
			},
			properties: {
				...properties,
				created: Date.now(),
				id: uuid(),
			},
    };
    // add center and bbox coordinates
		const center = centerOfMass(newFeature.geometry);
		newFeature.properties!.bbox = bbox(newFeature.geometry);
		newFeature.properties!.center = center.geometry.coordinates;
		// rebuild data with new feature
		const newData = { ...this.geojson };
		newData.features.push(newFeature);
		// update data in state
		this.setGeojson(newData);
	}

	// delete a specific existing feature
	deleteFeature(uuid: string) {
		if (!window.confirm("Are you sure you want to delete this feature?")) return;
		const updatedFeatureCollection = {
			...this.geojson,
			features: this.geojson.features.filter((feature) => feature.properties!.id !== uuid),
		};
		this.setGeojson(updatedFeatureCollection);
	}

	// update properties of a specific feature
	updateFeature(properties: featureProperties) {
		const updatedData = { ...this.geojson };
		updatedData.features = this.geojson.features.map((f) => {
			if (f.properties!.id !== properties.id) return f;
			else {
				const updatedFeature = { ...f };
				updatedFeature.properties = { ...properties };
				return updatedFeature;
			}
		});
		this.setGeojson(updatedData);
	}
}
