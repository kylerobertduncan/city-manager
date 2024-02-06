// mapboxgl and react hooks
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

// import material ui components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
// import styles
import "./App.css";
// import components
import Sidebar from "./components/Sidebar";
// import other local modules
import { localStorageId, mapboxLayerId, mapboxSourceId } from "./variables";

// add url restrictions before releasing production: https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

export default function App() {
	// setup map object and container
	const map: any = useRef(null);
	const mapContainer: any = useRef(null);
	// setup changable map properties
	const [mapCenter, setMapCenter] = useState({ lng: -79.35, lat: 43.68 });
	const [zoom, setZoom] = useState(11);

	// initialize map once on page load;
	useEffect(() => {
		if (map.current) return;
		// initialize new map
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/dark-v10",
			center: mapCenter,
			zoom: zoom,
		});
		// setup map listeners for user movement
		map.current.on("move", () => {
			const c = map.current.getCenter();
			setMapCenter({ lng: c.lng, lat: c.lat });
			setZoom(map.current.getZoom());
		});
		// add loaded data to map on load
		map.current.on("load", addDataToMap);
	});

	// setup geojson storage object
	const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection>({
		type: "FeatureCollection",
		features: [],
	});

	// store geojson data in state on page load
	useEffect(() => {
		// get item from localStorage,
		const item = localStorage.getItem(localStorageId);
		// it no item, reset storage to create empty feature collection item
		if (!item) resetLocalStorage();
		try {
			if (!item) return;
			const data: GeoJSON.FeatureCollection = JSON.parse(item);
			if (data) setGeojsonData(data);
		} catch (error: any) {
			// Handle the error here
			console.error("Error loading data from localStorage:", error.message);
			if (
				window.confirm(
					"Error loading data from local storage. Would you like to reset the data?"
				)
			)
				resetLocalStorage();
		}
	}, []);

	function refreshSourceData() {
		if (map.current.loaded()) addDataToMap();
		else map.current.on("load", addDataToMap);
	}

	// update localStorage and Mapbox when data in state changes
	useEffect(() => {
		// if features are empty, do nothing
		if (!geojsonData.features.length) return;
		// convert current data to a string and update localStorage
		try {
			const s = JSON.stringify(geojsonData);
			if (s) localStorage.setItem(localStorageId, s);
			// update mapbox data
			refreshSourceData();
			// catch and report any errors
		} catch (error: any) {
			console.error("Error updating localStorage:", error.message);
		}
	}, [geojsonData]);

	function resetLocalStorage() {
		if (
			!window.confirm(
				"You are about to erase any saved data. Would you like to continue?"
			)
		)
			return;
		// check for an existing item and if present, remove it
		if (localStorage.getItem(localStorageId))
			localStorage.removeItem(localStorageId);
		// add an item with an empty feature collection
		const emptyFeatureCollection: GeoJSON.FeatureCollection = {
			type: "FeatureCollection",
			features: [],
		};
		localStorage.setItem(
			localStorageId,
			JSON.stringify(emptyFeatureCollection)
		);
		setGeojsonData(emptyFeatureCollection);
	}

	function addDataToMap() {
		// if the geojson is empty, don't try to load data
		if (!geojsonData.features.length) return;
		// get the mapbox source
		const s = map.current.getSource(mapboxSourceId);
		// if already in place, set updated data
		if (s) {
			s.setData(geojsonData);
			// otherwise add source and layer to mapbox
		} else {
			map.current.addSource(mapboxSourceId, {
				type: "geojson",
				data: geojsonData,
			});
			map.current.addLayer(
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

	// store click lngLat in state to display (dev only)
	const [featureLngLat, setFeatureLngLat] = useState({ lng: 0, lat: 0 });
	// listen for click; get lngLat and save
	function addPoint() {
		// set cursor to a pointer
		map.current.getCanvas().style.cursor = "pointer";
		// listen for the users click
		map.current.once("click", (e: mapboxgl.EventData) => {
			// set data for dev display
			setFeatureLngLat(e.lngLat);
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
			// rebuild data with new feature
			const newData = { ...geojsonData };
			newData.features.push(newPoint);
			// update data in state
			setGeojsonData(newData);

			// return cursor to default
			map.current.getCanvas().style.cursor = "";
		});
	}

	return (
		<Grid container className="App">
			{/* MapWindow */}
			<Grid
				component="main"
				item
				xs={12}
				md={8}
				lg={9}
				sx={{ position: "relative" }}
			>
				{/* Mapbox container */}
				<Box
					className="map-container"
					component="div"
					height="100vh"
					ref={mapContainer}
				/>

				{/* lngLatZoom readout for dev only */}
				<Box
					className="floatingElement"
					sx={{ position: "absolute", top: 0, left: 0 }}
				>
					Center: Lng: {mapCenter.lng.toFixed(4)} | Lat:{" "}
					{mapCenter.lat.toFixed(4)} | Zoom: {zoom.toFixed(2)}
				</Box>

				{/* clickLngLat readout for dev only */}
				<Box
					className="floatingElement"
					sx={{ position: "absolute", top: 0, right: 0 }}
				>
					Click: Lng: {featureLngLat.lng.toFixed(4)} | Lat:{" "}
					{featureLngLat.lat.toFixed(4)}
				</Box>

				{/* Toolbar */}
				<Stack
					alignItems="center"
					direction="row"
					paddingY="12px"
					spacing={2}
					sx={{
						position: "absolute",
						bottom: 0,
						left: "50%",
						translate: "-50%",
					}}
				>
					{/* On mouse click, save the coordinates as a GeoJSON feature in localStorage */}
					<Button onClick={addPoint} variant="outlined">
						Add Point
					</Button>
					{/* <Button variant="outlined">Add Polygon</Button> */}
					<Button onClick={resetLocalStorage} variant="outlined">
						Clear Data
					</Button>
				</Stack>
			</Grid>

			{/* Sidebar */}
			<Sidebar geojsonData={geojsonData} />
		</Grid>
	);
}
