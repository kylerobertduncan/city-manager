// mapboxgl and react hooks
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
// import material ui components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// import styles
import "./App.css";
// import components
import Sidebar from "./components/Sidebar";
// import other local modules
import { localStorageId, mapboxLayerId, mapboxSourceId } from "./variables";
import Toolbar from "./components/Toolbar";

// add url restrictions before releasing production
// https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

export default function App() {
	const emptyFeatureCollection: GeoJSON.FeatureCollection = {
		type: "FeatureCollection",
		features: [],
	};
	// setup map object and container
	const map: any = useRef(null);
	const mapContainer: any = useRef(null);
	// setup state for changable map properties
	const [mapCenter, setMapCenter] = useState({ lng: -79.35, lat: 43.68 });
	const [zoom, setZoom] = useState(11);
	// setup state for local storage geojson object
	const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection>(
		emptyFeatureCollection
	);

  // possible alternative to useEffect with geojsonData dependency (i.e. call instead of setGeojsonData)
  function updateGeojsonData(newData:GeoJSON.FeatureCollection) {
		// convert current data to a string and update localStorage
		try {
			const s = JSON.stringify(newData);
			if (s) localStorage.setItem(localStorageId, s);
			// catch and report any errors
		} catch (error: any) {
			console.error("Error updating localStorage:", error.message);
		}
    setGeojsonData(newData);
		// update mapbox data
		mapboxUpdateData();
	}

  // extrapolate map and functions to a separate class module?
	function mapboxInit() {
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
	}

	function mapboxAddSource() {
		if (map.current.getSource(mapboxSourceId)) return;
		// add source
		map.current.addSource(mapboxSourceId, {
			type: "geojson",
			data: geojsonData,
		});
	}

	function mapboxAddLayer() {
		if (map.current.getLayer(mapboxLayerId)) return;
		// add layer
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

	function mapboxSetData() {
		const s = map.current.getSource(mapboxSourceId);
		s.setData(geojsonData);
	}

  function handleSourcedata(e:mapboxgl.EventData) {
    if (e.sourceId === mapboxSourceId && e.isSourceLoaded) {
			map.current.off("sourcedata", handleSourcedata);
			mapboxSetData();
		}
  }

	function mapboxUpdateData() {
    if (
			map.current.getSource(mapboxSourceId) &&
			map.current.isSourceLoaded(mapboxSourceId)
		) mapboxSetData();
    // Fired when one of the map's sources loads or changes
		else map.current.on("sourcedata", handleSourcedata);
	}

	function mapboxSetup() {
		// if no map initialise map
		if (!map.current) mapboxInit();
		// if map not loaded, re-run when loaded
		if (!map.current.loaded()) map.current.on("load", mapboxSetup);
		if (!map.current.isStyleLoaded()) return;
		// if source not loaded, load source
		if (!map.current.getSource(mapboxSourceId)) mapboxAddSource();
		// if layer(s) not loaded, load layer(s)
		if (!map.current.getLayer(mapboxLayerId)) mapboxAddLayer();
	}

	// store geojson data in state on page load
	function initializeLocalStorage() {
		// get item from localStorage,
		const item = localStorage.getItem(localStorageId);
		// it no item, reset storage to create empty feature collection item
		// if (!item) clearAllData();
		// what if localStorage is lost (cache cleared) but data is still present in state? Worth preserving state?
		try {
			if (!item) return;
			const data: GeoJSON.FeatureCollection = JSON.parse(item);
			if (data) setGeojsonData(data);
		} catch (error: any) {
			// Handle the error here
			console.error("Error loading data from localStorage:", error.message);
			clearAllData();
		}
	}

	// get local storage and initialize map once on page load
	useEffect(() => {
		initializeLocalStorage();
		mapboxSetup();
	}, []);

	// update localStorage and Mapbox when data in state changes
	useEffect(() => {
		if (!geojsonData.features.length) return;
		// convert current data to a string and update localStorage
		try {
			const s = JSON.stringify(geojsonData);
			if (s) localStorage.setItem(localStorageId, s);
			// catch and report any errors
		} catch (error: any) {
			console.error("Error updating localStorage:", error.message);
		}
		// update mapbox data
		mapboxUpdateData();
	}, [geojsonData]);

	/* USER FUNCTIONS */

  // add a point feature to the map (and data)
	function addPoint() {
		// set cursor to a pointer
		map.current.getCanvas().style.cursor = "pointer";
		// listen for the users click
		map.current.once("click", (e: mapboxgl.EventData) => {
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

  // erase all data
	function clearAllData() {
		if (!window.confirm("Erase all data?")) return;
		// update mapbox data with an empty feature collection
		const s = map.current.getSource(mapboxSourceId);
		if (!s) return;
		s.setData(emptyFeatureCollection);
    // replace localStorage item with an empty feature collection
		localStorage.setItem(
			localStorageId,
			JSON.stringify(emptyFeatureCollection)
		);
		// reset data in state with an empty feature collection
		setGeojsonData(emptyFeatureCollection);
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

				{/* Toolbar */}
			  <Toolbar addPoint={addPoint} clearAllData={clearAllData} />

			</Grid>

			{/* Sidebar */}
			<Sidebar geojsonData={geojsonData} />
		</Grid>
	);
}
