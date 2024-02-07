import { v4 as uuid } from "uuid";
import { mapboxLayerId, mapboxSourceId } from "../variables";

function initializeMapData(
	geojsonData: GeoJSON.FeatureCollection,
	map: mapboxgl.Map
) {
	map.addSource(mapboxSourceId, {
		type: "geojson",
		data: geojsonData,
	});
	map.addLayer(
		{
			id: mapboxLayerId,
			source: mapboxSourceId,
			type: "circle",
			paint: {
				"circle-color": "red",
			},
		},
		"road-label"
	);
}

function addDataToMap(
	geojsonData: GeoJSON.FeatureCollection,
	map: mapboxgl.Map
) {
	// get the mapbox source
	const s = map.getSource(mapboxSourceId);
  if (s.type !== "geojson") return;
	// if already in place, set updated data
	if (s) {
		s.setData(geojsonData);
		// otherwise add source and layer to mapbox
	} else {
		map.addSource(mapboxSourceId, {
			type: "geojson",
			data: geojsonData,
		});
		map.addLayer(
			{
				id: mapboxLayerId,
				source: mapboxSourceId,
				type: "circle",
				paint: {
					"circle-color": "red",
				},
			},
			"road-label"
		);
	}
}

// listen for click; get lngLat and save
function addPoint(map:mapboxgl.Map) {
	// set cursor to a pointer
	map.getCanvas().style.cursor = "pointer";

	// listen for the users click
	map.once("click", (e: mapboxgl.EventData) => {
		// set data for dev display
		// setFeatureLngLat(e.lngLat);
		
    // create new feature
		const newPoint: GeoJSON.Feature = {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [e.lngLat.lng, e.lngLat.lat],
			},
			properties: {
				address: "",
				color: "",
				created: Date.now(),
				id: uuid(),
				name: "",
				notes: [],
				tags: [],
			},
		};

		// // rebuild data with new feature
		// const newData = { ...geojsonData };
		// newData.features.push(newPoint);
		// // update data in state
		// setGeojsonData(newData);

		// return cursor to default
		map.getCanvas().style.cursor = "";
	});
}

function addPointLayer(map: mapboxgl.Map) {
  map.addLayer(
		{
			id: mapboxLayerId,
			source: mapboxSourceId,
			type: "circle",
			paint: {
				"circle-color": "red",
			},
		},
		"road-label"
	);
}